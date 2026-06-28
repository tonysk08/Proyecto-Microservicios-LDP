import { Controller, Get } from '@nestjs/common';
import { PriceServiceService } from './price-service.service';

@Controller()
export class PriceServiceController {
  constructor(private readonly priceServiceService: PriceServiceService) {}

  @Get()
  getHello(): string {
    return this.priceServiceService.getHello();
  }
}
