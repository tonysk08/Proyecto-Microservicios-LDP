import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OrchestratorModule } from './orchestrator.module';

async function bootstrap() {
  const config = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrchestratorModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [config.getOrThrow<string>('RABBITMQ_URL')],
        queue: config.getOrThrow<string>('ORCHESTRATOR_QUEUE'),
        queueOptions: { durable: true },
        // La cola viene predeclarada (con DLX) en rabbitmq/definitions.json
        noAssert: true,
        // Ack manual: los handlers confirman/llevan a DLQ vía consumeWithDlq (LDP-022)
        noAck: false,
      },
    },
  );

  await app.listen();
  console.log('Scraper-Orchestrator esta escuchando en RabbitMQ...');
}
bootstrap();
