import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { QuoteRequestDto } from './dto/quote-request.dto';

@ApiTags('Quotes')
@Controller('quotes')
export class QuotesController {
  constructor(@Inject('PRICE_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  @ApiOperation({
    summary: 'Cotizar una canasta básica (total por supermercado + recomendación)',
  })
  async quote(@Body() dto: QuoteRequestDto) {
    return firstValueFrom(
      this.client.send({ cmd: 'generate_quote' }, { items: dto.items }),
    );
  }
}
