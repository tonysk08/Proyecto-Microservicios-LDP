import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { consumeWithDlq } from '@app/common';
import type { ScrapingRequestedEvent } from '@app/shared-contracts';
import { OrchestratorService } from './orchestrator.service';

@Controller()
export class OrchestratorController {
  constructor(private readonly orchestrator: OrchestratorService) {}

  @EventPattern('scraping.requested')
  async onRequested(
    @Payload() event: ScrapingRequestedEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    // ack manual: si falla el despacho → nack sin requeue → DLQ (dlq.scraping.exchange)
    await consumeWithDlq(context, () =>
      this.orchestrator.handleRequested(event),
    );
  }

  @EventPattern('scraping.completed')
  async onCompleted(
    @Payload()
    event: { correlationId?: string; payload?: { supermarketId?: string } },
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await consumeWithDlq(context, async () => {
      this.orchestrator.handleCompleted(event);
    });
  }
}
