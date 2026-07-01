import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { consumeWithDlq } from '@app/common';
import { MatchingService } from './matching.service';

@Controller()
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  /** Empareja productos crudos cuando un scraper publica scraping.completed. */
  @EventPattern('scraping.completed')
  async onScrapingCompleted(
    @Payload() event: Parameters<MatchingService['matchFromScraping']>[0],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await consumeWithDlq(context, async () => {
      await this.matchingService.matchFromScraping(event);
    });
  }
}
