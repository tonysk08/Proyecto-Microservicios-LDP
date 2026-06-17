import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CatalogServiceService } from './catalog-service.service';

@Controller()
export class CatalogServiceController {
  constructor(private readonly catalogService: CatalogServiceService) {}

  @MessagePattern({cmd: 'get_catalogs'})
  async getCatalogs() {
    return this.catalogService.findAll();
  }
}
