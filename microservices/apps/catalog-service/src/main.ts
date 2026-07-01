import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CatalogServiceModule } from './catalog-service.module';

async function bootstrap() {
  // Config del transporte desde variables de entorno (sin literales hardcodeados)
  const config = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [config.getOrThrow<string>('RABBITMQ_URL')],
        queue: config.getOrThrow<string>('CATALOG_QUEUE'),
        queueOptions: { durable: true },
      },
    },
  );

  await app.listen();
  console.log('Catalog-Service esta escuchando en RabbitMQ...');
}
bootstrap();
