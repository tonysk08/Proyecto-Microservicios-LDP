import { Controller, Get } from '@nestjs/common';
import { PriceServiceService } from './price-service.service';
import { Payload, MessagePattern } from '@nestjs/microservices';

@Controller()
export class PriceServiceController {
  constructor(private readonly priceServiceService: PriceServiceService) {}

  @MessagePattern({ cmd: 'get_price_history' })
  async getPriceHistory(@Payload() data : { productId: string;}) {
    return this.priceServiceService.getPriceHistory(data.productId);
  }
}