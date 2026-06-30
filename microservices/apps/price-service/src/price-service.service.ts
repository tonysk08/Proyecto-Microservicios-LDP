import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { buildEvent, RmqPublisherService } from '@app/common';
import { PriceRecordEntity } from './entities/price-record.entity';
import { PriceSnapshotEntity } from './entities/price-snapshot.entity';

interface RawProductMsg {
  rawName: string;
  price: number;
  supermarketId: string;
  currency?: string;
  sourceUrl?: string;
  scrapedAt?: string;
}

@Injectable()
export class PriceServiceService {
  private readonly logger = new Logger(PriceServiceService.name);

  constructor(
    @InjectRepository(PriceRecordEntity)
    private readonly priceRecordRepo: Repository<PriceRecordEntity>,
    @InjectRepository(PriceSnapshotEntity)
    private readonly priceSnapshotRepo: Repository<PriceSnapshotEntity>,
    private readonly publisher: RmqPublisherService,
  ) {}

  /**
   * Registra los precios de un evento scraping.completed:
   *  - inserta un price_record (historial inmutable),
   *  - hace upsert del price_snapshot (último precio por supermercado+producto),
   *  - publica price.created.
   * Keyed por (supermarketId, rawName) mientras no exista el match al catálogo.
   */
  async recordPrices(event: {
    correlationId?: string;
    payload?: { supermarketId?: string; rawProducts?: RawProductMsg[] };
  }): Promise<{ recorded: number }> {
    const correlationId = event?.correlationId;
    const eventSuper = event?.payload?.supermarketId;
    const rawProducts = event?.payload?.rawProducts ?? [];

    let recorded = 0;
    for (const rp of rawProducts) {
      const supermarketId = rp?.supermarketId ?? eventSuper;
      if (!rp?.rawName || rp?.price == null || !supermarketId) continue;

      const currency = rp.currency ?? 'USD';
      const scrapedAt = rp.scrapedAt ? new Date(rp.scrapedAt) : new Date();

      // 1) historial inmutable
      await this.priceRecordRepo.insert({
        catalogProductId: null,
        rawName: rp.rawName,
        supermarketId,
        price: rp.price,
        currency,
        sourceUrl: rp.sourceUrl ?? null,
        scrapedAt,
      });

      // 2) snapshot (último precio) — upsert con swap de previous/current
      await this.priceSnapshotRepo.query(
        `INSERT INTO "pricing"."price_snapshots"
           ("supermarket_id", "raw_name", "current_price", "currency")
         VALUES ($1, $2, $3, $4)
         ON CONFLICT ("supermarket_id", "raw_name")
         DO UPDATE SET
           "previous_price" = "price_snapshots"."current_price",
           "current_price"  = EXCLUDED."current_price",
           "updated_at"     = now()`,
        [supermarketId, rp.rawName, rp.price, currency],
      );

      // 3) evento de precio (lo audita el tap # de pricing.exchange)
      await this.publisher.publish('pricing.exchange', 'price.created', {
        pattern: 'price.created',
        data: buildEvent(
          'price.created',
          {
            supermarketId,
            rawName: rp.rawName,
            price: rp.price,
            currency,
            scrapedAt: scrapedAt.toISOString(),
            sourceUrl: rp.sourceUrl,
          },
          correlationId,
        ),
      });

      recorded++;
    }

    this.logger.log(
      `scraping.completed: ${rawProducts.length} recibidos, ${recorded} precios registrados`,
    );
    return { recorded };
  }

  /**
   * Rellena catalog_product_id en records y snapshot cuando el matching enlaza
   * el producto crudo con el catálogo (habilita la comparación cross-súper).
   */
  async backfillCatalogProductId(
    supermarketId: string,
    rawName: string,
    catalogProductId: string,
  ): Promise<void> {
    await this.priceSnapshotRepo.query(
      `UPDATE "pricing"."price_snapshots" SET "catalog_product_id" = $1
        WHERE "supermarket_id" = $2 AND "raw_name" = $3`,
      [catalogProductId, supermarketId, rawName],
    );
    await this.priceRecordRepo.query(
      `UPDATE "pricing"."price_records" SET "catalog_product_id" = $1
        WHERE "supermarket_id" = $2 AND "raw_name" = $3`,
      [catalogProductId, supermarketId, rawName],
    );
    this.logger.log(
      `product.normalized: backfill catalog_product_id ${supermarketId}/${rawName}`,
    );
  }

  // ───────────────────────── Consultas (RPC) ─────────────────────────

  /** Comparación de precios de un producto entre supermercados. */
  async getComparison(catalogProductId: string) {
    const rows = await this.priceSnapshotRepo.find({
      where: { catalogProductId },
    });
    const prices = rows
      .map((r) => ({
        supermarketId: r.supermarketId,
        price: Number(r.currentPrice),
      }))
      .sort((a, b) => a.price - b.price);

    if (!prices.length) {
      return { catalogProductId, prices: [], cheapest: null, maxDiffPct: 0 };
    }
    const cheapest = prices[0];
    const dearest = prices[prices.length - 1].price;
    const maxDiffPct =
      cheapest.price > 0
        ? Math.round(((dearest - cheapest.price) / cheapest.price) * 1000) / 10
        : 0;
    return { catalogProductId, prices, cheapest, maxDiffPct };
  }

  /** Histórico de precios de un producto (más recientes primero). */
  async getHistory(catalogProductId: string, limit = 50) {
    const rows = await this.priceRecordRepo.find({
      where: { catalogProductId },
      order: { recordedAt: 'DESC' },
      take: Math.min(200, Math.max(1, limit)),
    });
    return rows.map((r) => ({
      supermarketId: r.supermarketId,
      price: Number(r.price),
      currency: r.currency,
      scrapedAt: r.scrapedAt,
      recordedAt: r.recordedAt,
    }));
  }

  /** Cotización de una canasta: total por supermercado + recomendación. */
  async generateQuote(
    items: Array<{ catalogProductId: string; quantity?: number }>,
    correlationId?: string,
  ) {
    const ids = items.map((i) => i.catalogProductId).filter(Boolean);
    if (!ids.length) {
      return { items: [], totalsBySupermarket: [], cheapestSupermarketId: null };
    }
    const snapshots = await this.priceSnapshotRepo
      .createQueryBuilder('s')
      .where('s.catalogProductId IN (:...ids)', { ids })
      .getMany();

    // mapa: supermarket -> { total, cubiertos }
    const bySuper = new Map<
      string,
      { supermarketId: string; total: number; itemsCovered: number }
    >();
    for (const item of items) {
      const qty = Math.max(1, item.quantity ?? 1);
      for (const snap of snapshots.filter(
        (s) => s.catalogProductId === item.catalogProductId,
      )) {
        const entry = bySuper.get(snap.supermarketId) ?? {
          supermarketId: snap.supermarketId,
          total: 0,
          itemsCovered: 0,
        };
        entry.total += Number(snap.currentPrice) * qty;
        entry.itemsCovered += 1;
        bySuper.set(snap.supermarketId, entry);
      }
    }

    const totalsBySupermarket = [...bySuper.values()].map((e) => ({
      ...e,
      total: Math.round(e.total * 100) / 100,
      complete: e.itemsCovered === ids.length,
    }));

    // recomendado: el más barato que cubre toda la canasta; si ninguno, el más completo y barato
    const complete = totalsBySupermarket
      .filter((t) => t.complete)
      .sort((a, b) => a.total - b.total);
    const fallback = [...totalsBySupermarket].sort(
      (a, b) => b.itemsCovered - a.itemsCovered || a.total - b.total,
    );
    const cheapestSupermarketId =
      (complete[0] ?? fallback[0])?.supermarketId ?? null;

    const result = { items, totalsBySupermarket, cheapestSupermarketId };

    await this.publisher.publish('quotes.exchange', 'quote.generated', {
      pattern: 'quote.generated',
      data: buildEvent(
        'quote.generated',
        { cheapestSupermarketId, totalsBySupermarket },
        correlationId,
      ),
    });

    return result;
  }
}

