import { NestFactory } from '@nestjs/core';
import { PriceServiceModule } from './price-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PriceServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
        queue: 'price_queue',
        queueOptions: {
          durable: true,
        },
      },
    }
  );
  await app.listen();
  console.log(`Price-Service esta escuchando en RabbitMQ...`);
}
bootstrap();
