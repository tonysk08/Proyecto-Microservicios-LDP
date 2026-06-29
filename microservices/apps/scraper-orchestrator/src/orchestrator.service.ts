import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { buildEvent, RmqPublisherService } from '@app/common';
import type { ScrapingRequestedEvent } from '@app/shared-contracts';

@Injectable()
export class OrchestratorService implements OnModuleDestroy {
  private readonly logger = new Logger(OrchestratorService.name);
  private readonly timers = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly publisher: RmqPublisherService,
    private readonly config: ConfigService,
  ) {}

  private get exchange(): string {
    return this.config.get<string>('SCRAPING_EXCHANGE') ?? 'scraping.exchange';
  }

  private get timeoutMs(): number {
    return Number(this.config.get<string>('SCRAPE_TIMEOUT_MS') ?? 120000);
  }

  private get defaultSupers(): string[] {
    return (
      this.config.get<string>('SCRAPER_IDS') ??
      'super99,riba-smith,el-machetazo'
    )
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /** Consume scraping.requested → despacha a los scrapers + emite scraping.started. */
  async handleRequested(event: ScrapingRequestedEvent): Promise<void> {
    const correlationId = event?.correlationId ?? randomUUID();
    const requested = event?.payload?.supermarketId;
    const supers = requested ? [requested] : this.defaultSupers;
    this.logger.log(
      `scraping.requested corr=${correlationId} → [${supers.join(', ')}]`,
    );

    for (const id of supers) {
      // 1) despacho del comando a la cola específica del scraper
      await this.publisher.publish(this.exchange, `scrape.${id}`, {
        pattern: 'scrape.execute',
        data: { correlationId, supermarketId: id },
      });
      // 2) evento de inicio (auditoría)
      await this.publisher.publish(this.exchange, 'scraping.started', {
        pattern: 'scraping.started',
        data: buildEvent(
          'scraping.started',
          { supermarketId: id, supermarketName: id },
          correlationId,
        ),
      });
      // 3) vigilancia de timeout
      this.armTimeout(correlationId, id);
    }
  }

  /** Consume scraping.completed → cancela el timeout correspondiente. */
  handleCompleted(event: {
    correlationId?: string;
    payload?: { supermarketId?: string };
  }): void {
    const correlationId = event?.correlationId;
    const id = event?.payload?.supermarketId;
    if (correlationId && id) {
      this.cancelTimeout(correlationId, id);
      this.logger.log(`scraping.completed corr=${correlationId} super=${id}`);
    }
  }

  private key(correlationId: string, id: string): string {
    return `${correlationId}:${id}`;
  }

  private armTimeout(correlationId: string, id: string): void {
    const k = this.key(correlationId, id);
    this.cancelTimeout(correlationId, id);
    const timer = setTimeout(() => {
      this.timers.delete(k);
      this.logger.warn(`Timeout ${k} → scraping.failed`);
      void this.publisher.publish(this.exchange, 'scraping.failed', {
        pattern: 'scraping.failed',
        data: buildEvent(
          'scraping.failed',
          {
            supermarketId: id,
            reason: 'timeout',
            error: `Sin scraping.completed en ${this.timeoutMs}ms`,
            retryCount: 0,
          },
          correlationId,
        ),
      });
    }, this.timeoutMs);
    this.timers.set(k, timer);
  }

  private cancelTimeout(correlationId: string, id: string): void {
    const k = this.key(correlationId, id);
    const timer = this.timers.get(k);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(k);
    }
  }

  onModuleDestroy(): void {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
  }
}
