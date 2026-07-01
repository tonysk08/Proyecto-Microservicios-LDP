import { NestFactory } from '@nestjs/core';
import { AuditModule } from './audit.module';

async function bootstrap() {
  // Servicio consumidor: el contexto inicializa TypeORM y el consumidor amqp;
  // la conexión RabbitMQ mantiene el proceso vivo.
  const app = await NestFactory.createApplicationContext(AuditModule);
  app.enableShutdownHooks();
  console.log('Audit-Service esta auditando eventos...');
}
bootstrap();
