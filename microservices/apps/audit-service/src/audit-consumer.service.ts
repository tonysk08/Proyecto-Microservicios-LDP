import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as amqp from 'amqp-connection-manager';
import type {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import type { ConfirmChannel, ConsumeMessage } from 'amqplib';
import { EventLogEntity } from './entities/event-log.entity';

/**
 * Consume el tap `#` (audit_queue) — que recibe TODOS los eventos del sistema —
 * y los persiste en bd_logs. Usa amqplib directo (no @EventPattern) para capturar
 * cualquier routing key sin declarar un handler por tipo.
 */
@Injectable()
export class AuditConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AuditConsumerService.name);
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;

  constructor(
    @InjectRepository(EventLogEntity)
    private readonly repo: Repository<EventLogEntity>,
    private readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    const queue = this.config.getOrThrow<string>('AUDIT_QUEUE');
    this.connection = amqp.connect([
      this.config.getOrThrow<string>('RABBITMQ_URL'),
    ]);
    this.channel = this.connection.createChannel({
      json: false,
      setup: (ch: ConfirmChannel) =>
        ch.consume(queue, (msg) => this.handle(ch, msg), { noAck: false }),
    });
    this.logger.log(`Auditando la cola '${queue}'...`);
  }

  private async handle(
    ch: ConfirmChannel,
    msg: ConsumeMessage | null,
  ): Promise<void> {
    if (!msg) return;
    try {
      const parsed = JSON.parse(msg.content.toString());
      // sobre NestJS {pattern,data} o mensaje plano
      const data = parsed?.data ?? parsed ?? {};
      const eventType: string =
        data.eventType ?? parsed?.pattern ?? msg.fields.routingKey ?? 'unknown';

      await this.repo.insert({
        eventType,
        correlationId: data.correlationId ?? null,
        serviceName: eventType.split('.')[0] || 'system',
        payload: data.payload ?? data,
        level: 'info',
      });
      ch.ack(msg);
    } catch (err) {
      this.logger.warn(`Mensaje de auditoría descartado: ${String(err)}`);
      ch.nack(msg, false, false); // malformado → descartar
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}
