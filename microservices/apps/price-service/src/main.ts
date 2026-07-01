import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PriceServiceModule } from './price-service.module';

async function bootstrap() {
  // Config del transporte desde variables de entorno (sin literales hardcodeados)
  const config = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PriceServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [config.getOrThrow<string>('RABBITMQ_URL')],
        queue: config.getOrThrow<string>('PRICE_QUEUE'),
        queueOptions: { durable: true },
        // Cola de eventos predeclarada (con DLX) en definitions.json
        noAssert: true,
        // Ack manual: consumeWithDlq confirma o lleva a DLQ (LDP-022)
        noAck: false,
      },
    },
  );

  await app.listen();
  console.log('Price-Service esta escuchando en RabbitMQ...');
}
bootstrap();
