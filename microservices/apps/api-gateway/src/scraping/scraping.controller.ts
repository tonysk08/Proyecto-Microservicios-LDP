import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { buildEvent, RmqPublisherService } from '@app/common';
import { ScrapingRequestDto } from './dto/scraping-request.dto';

@ApiTags('Scraping')
@Controller('scraping')
export class ScrapingController {
  constructor(private readonly publisher: RmqPublisherService) {}

  @Post('request')
  @ApiOperation({
    summary:
      'Dispara un proceso de scraping. Omite supermarketId para scrapear todos.',
  })
  async request(@Body() dto: ScrapingRequestDto) {
    const correlationId = randomUUID();
    await this.publisher.publish('scraping.exchange', 'scraping.requested', {
      pattern: 'scraping.requested',
      data: buildEvent(
        'scraping.requested',
        {
          supermarketId: dto.supermarketId,
          requestedBy: 'api',
          priority: 'normal',
        },
        correlationId,
      ),
    });
    return {
      message: 'Scraping solicitado',
      correlationId,
      target: dto.supermarketId ?? 'todos',
    };
  }
}
