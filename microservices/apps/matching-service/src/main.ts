import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MatchingModule } from './matching.module';

async function bootstrap() {
  const config = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MatchingModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [config.getOrThrow<string>('RABBITMQ_URL')],
        queue: config.getOrThrow<string>('MATCHING_QUEUE'),
        queueOptions: { durable: true },
        // Cola de eventos predeclarada (con DLX) en definitions.json
        noAssert: true,
        // Ack manual: consumeWithDlq confirma o lleva a DLQ
        noAck: false,
      },
    },
  );

  await app.listen();
  console.log('Matching-Service esta escuchando en RabbitMQ...');
}
bootstrap();
