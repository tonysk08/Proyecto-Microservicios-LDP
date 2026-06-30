import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { consumeWithDlq, handleRpc } from '@app/common';
import { PriceServiceService } from './price-service.service';

@Controller()
export class PriceServiceController {
  constructor(private readonly priceService: PriceServiceService) {}

  // ───────────────────────── Consultas RPC ─────────────────────────

  @MessagePattern({ cmd: 'get_price_comparison' })
  async comparison(
    @Payload() data: { catalogProductId: string },
    @Ctx() context: RmqContext,
  ) {
    return handleRpc(context, () =>
      this.priceService.getComparison(data.catalogProductId),
    );
  }

  @MessagePattern({ cmd: 'get_price_history' })
  async history(
    @Payload() data: { catalogProductId: string; limit?: number },
    @Ctx() context: RmqContext,
  ) {
    return handleRpc(context, () =>
      this.priceService.getHistory(data.catalogProductId, data.limit),
    );
  }

  @MessagePattern({ cmd: 'generate_quote' })
  async quote(
    @Payload()
    data: { items: Array<{ catalogProductId: string; quantity?: number }> },
    @Ctx() context: RmqContext,
  ) {
    return handleRpc(context, () =>
      this.priceService.generateQuote(data.items ?? []),
    );
  }

  /** Registra precios cuando un scraper publica scraping.completed. */
  @EventPattern('scraping.completed')
  async onScrapingCompleted(
    @Payload()
    event: Parameters<PriceServiceService['recordPrices']>[0],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await consumeWithDlq(context, async () => {
      await this.priceService.recordPrices(event);
    });
  }

  /** Rellena catalog_product_id cuando matching publica product.normalized. */
  @EventPattern('product.normalized')
  async onProductNormalized(
    @Payload()
    event: {
      payload?: {
        supermarketId?: string;
        rawName?: string;
        catalogProductId?: string;
      };
    },
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await consumeWithDlq(context, async () => {
      const p = event?.payload;
      if (p?.supermarketId && p?.rawName && p?.catalogProductId) {
        await this.priceService.backfillCatalogProductId(
          p.supermarketId,
          p.rawName,
          p.catalogProductId,
        );
      }
    });
  }
}
