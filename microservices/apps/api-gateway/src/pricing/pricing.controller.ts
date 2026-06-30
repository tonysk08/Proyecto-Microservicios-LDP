import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
  constructor(
    @Inject('PRICE_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get('compare')
  @ApiOperation({
    summary: 'Comparar el precio de un producto entre supermercados',
  })
  @ApiQuery({ name: 'productId', required: true, type: String })
  async compare(@Query('productId') productId: string) {
    return firstValueFrom(
      this.client.send(
        { cmd: 'get_price_comparison' },
        { catalogProductId: productId },
      ),
    );
  }

  @Get('history')
  @ApiOperation({ summary: 'Histórico de precios de un producto' })
  @ApiQuery({ name: 'productId', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  async history(
    @Query('productId') productId: string,
    @Query('limit') limit?: string,
  ) {
    return firstValueFrom(
      this.client.send(
        { cmd: 'get_price_history' },
        { catalogProductId: productId, limit: limit ? Number(limit) : 50 },
      ),
    );
  }
}
