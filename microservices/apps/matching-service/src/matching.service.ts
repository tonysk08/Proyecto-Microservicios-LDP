import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { buildEvent, RmqPublisherService } from '@app/common';
import { ProductMatchEntity } from './entities/product-match.entity';
import { similarity } from './algorithms/similarity.util';

interface RawProductMsg {
  rawName: string;
  supermarketId?: string;
}

interface CatalogProduct {
  id: string;
  name: string;
  brand?: string;
  presentation?: string;
  unit?: string;
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    @InjectRepository(ProductMatchEntity)
    private readonly matchRepo: Repository<ProductMatchEntity>,
    @Inject('CATALOG_SERVICE') private readonly catalogClient: ClientProxy,
    private readonly publisher: RmqPublisherService,
    private readonly config: ConfigService,
  ) {}

  private get threshold(): number {
    return Number(this.config.get<string>('SIMILARITY_THRESHOLD') ?? 0.6);
  }

  /** Empareja los productos crudos de un scraping.completed con el catálogo. */
  async matchFromScraping(event: {
    correlationId?: string;
    payload?: { supermarketId?: string; rawProducts?: RawProductMsg[] };
  }): Promise<{ matched: number }> {
    const correlationId = event?.correlationId;
    const eventSuper = event?.payload?.supermarketId;
    const rawProducts = event?.payload?.rawProducts ?? [];
    if (!rawProducts.length) return { matched: 0 };

    const candidates = await this.loadCandidates();
    if (!candidates.length) {
      this.logger.warn('Sin productos de catálogo para emparejar');
      return { matched: 0 };
    }

    let matched = 0;
    for (const rp of rawProducts) {
      const supermarketId = rp?.supermarketId ?? eventSuper;
      if (!rp?.rawName || !supermarketId) continue;

      let best: { score: number; cand: CatalogProduct } | null = null;
      for (const cand of candidates) {
        const target = `${cand.name} ${cand.brand ?? ''} ${cand.presentation ?? ''} ${cand.unit ?? ''}`;
        const score = similarity(rp.rawName, target);
        if (!best || score > best.score) best = { score, cand };
      }

      if (!best || best.score < this.threshold) continue;

      const rawRef = `${supermarketId}:${rp.rawName}`;
      const method = best.score >= 0.999 ? 'exact' : 'fuzzy';

      await this.matchRepo
        .createQueryBuilder()
        .insert()
        .into(ProductMatchEntity)
        .values({
          rawProductId: rawRef,
          catalogProductId: best.cand.id,
          confidenceScore: best.score,
          matchMethod: method,
          isActive: true,
        })
        .orIgnore() // idempotente por unique(raw_product_id)
        .execute();

      await this.publisher.publish('products.exchange', 'product.normalized', {
        pattern: 'product.normalized',
        data: buildEvent(
          'product.normalized',
          {
            rawProductId: rawRef,
            catalogProductId: best.cand.id,
            supermarketId,
            rawName: rp.rawName,
            confidenceScore: best.score,
            product: best.cand,
          },
          correlationId,
        ),
      });

      matched++;
    }

    this.logger.log(
      `scraping.completed: ${rawProducts.length} crudos, ${matched} emparejados (umbral ${this.threshold})`,
    );
    return { matched };
  }

  /** Trae los productos del catálogo vía RPC al catalog-service. */
  private async loadCandidates(): Promise<CatalogProduct[]> {
    const resp = await firstValueFrom(
      this.catalogClient.send(
        { cmd: 'get_catalogs' },
        { page: 1, limit: 100, isActive: true, includeRaw: false },
      ),
    );
    const data = (resp?.data ?? resp ?? []) as CatalogProduct[];
    return Array.isArray(data) ? data : [];
  }
}
