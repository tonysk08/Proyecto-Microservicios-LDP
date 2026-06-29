// apps/api-gateway/src/pricing/pricing.controller.ts
import {
  Controller, Get, Param, Inject,
  NotFoundException, InternalServerErrorException , BadRequestException
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { firstValueFrom, catchError } from 'rxjs';

@ApiTags('pricing')
@Controller('Pricing')
export class PricingController {
  constructor(
    @Inject('PRICE_SERVICE') private readonly client: ClientProxy
  ) {}

  @Get('history/:productId')
  @ApiOperation({ summary: 'Historial de precios de un producto por ID' })
  @ApiParam({ name: 'productId', description: 'UUID del producto en catalog-service' })
  async getPriceHistory(@Param('productId') productId: string) {
    return firstValueFrom(
      this.client.send({ cmd: 'get_price_history' }, { productId })
       .pipe(
            catchError((error) => {
                switch (error?.statusCode) {
                case 400:
                    throw new BadRequestException(error.message);
                case 404:
                    throw new NotFoundException(error.message);
                default:
                    throw new InternalServerErrorException(
                    'Unexpected error from catalog service',
                    );
                }
            }),
        )
    );
  }
}