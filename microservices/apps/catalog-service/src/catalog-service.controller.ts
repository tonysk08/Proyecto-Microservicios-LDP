import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CatalogServiceService } from './catalog-service.service';

@Controller()
export class CatalogServiceController {
  constructor(private readonly catalogService: CatalogServiceService) {}

  // ── Eventos ───────────────────────────────────────────────
  /** Persiste los productos crudos cuando un scraper publica scraping.completed. */
  @EventPattern('scraping.completed')
  async onScrapingCompleted(
    @Payload()
    event: {
      payload?: {
        rawProducts?: Array<{
          rawName: string;
          supermarketId: string;
          rawBrand?: string | null;
          sourceUrl?: string | null;
        }>;
      };
    },
  ): Promise<void> {
    await this.catalogService.ingestRawProducts(event?.payload?.rawProducts ?? []);
  }

  @MessagePattern({ cmd: 'get_catalogs' })
  async getCatalogs(
    @Payload()
    data: {
      page?: number;
      limit?: number;
      category?: string;
      isActive?: boolean;
      includeRaw?: boolean;
    },
  ) {
    return this.catalogService.findAll({
      page: data.page ?? 1,
      limit: data.limit ?? 20,
      category: data.category,
      isActive: data.isActive ?? true,
      includeRaw: data.includeRaw ?? false,
    });
  }

  @MessagePattern({cmd: 'search_catalogs'})
  async searchProducts( data: { query: string }) {
    return this.catalogService.searchProducts(data.query);
  }

  @MessagePattern({cmd: 'get_catalog_by_id'})
  async getCatalogById(data: { id: string }) {
    return this.catalogService.findById(data.id);
  }

  @MessagePattern({cmd: 'deactivate_catalog'})
  async deactivateCatalog(@Payload() data: { id: string }) {
    return this.catalogService.deactivateCatalog(data.id);
  }

  @MessagePattern({cmd: 'activate_catalog'})
  async activateCatalog(@Payload() data: { id: string }) {
    return this.catalogService.activateCatalog(data.id);
  }

  @MessagePattern({ cmd: 'remove_catalog' })
  async removeCatalog(@Payload() data: { id: string }) {
    return this.catalogService.removeCatalog(data.id);
  }
}
