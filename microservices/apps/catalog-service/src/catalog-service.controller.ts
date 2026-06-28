import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CatalogServiceService } from './catalog-service.service';

@Controller()
export class CatalogServiceController {
  constructor(private readonly catalogService: CatalogServiceService) {}

  @MessagePattern({cmd: 'get_catalogs'})
  async getCatalogs() {
    return this.catalogService.findAll({active: true});
  }

    @MessagePattern({cmd: 'get_catalogs_deactivated'})
  async getCatalogsDeactivated() {
    return this.catalogService.findAll({active: false});
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
