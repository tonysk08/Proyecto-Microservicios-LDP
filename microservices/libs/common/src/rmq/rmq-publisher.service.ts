import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import type {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';

/**
 * Publicador a exchanges topic vía amqp-connection-manager.
 * El transporte RMQ nativo de NestJS es queue-céntrico y no publica a exchanges
 * con routing key arbitraria; por eso usamos amqplib directamente.
 */
@Injectable()
export class RmqPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RmqPublisherService.name);
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    this.connection = amqp.connect([
      this.config.getOrThrow<string>('RABBITMQ_URL'),
    ]);
    this.channel = this.connection.createChannel({
      json: true,
      setup: () => Promise.resolve(),
    });
    this.logger.log('Publicador RMQ inicializado');
  }

  async publish(
    exchange: string,
    routingKey: string,
    message: unknown,
  ): Promise<void> {
    await this.channel.publish(exchange, routingKey, message, {
      contentType: 'application/json',
      persistent: true,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}
