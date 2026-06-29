import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const server = app.getHttpServer();
  server.setTimeout(10000); // timeout de 10s para las peticiones

  // Validación global de DTOs (requiere class-validator / class-transformer)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();
  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Monitoreo de Precios — API Gateway')
      .setDescription(
        'API centralizada para el monitoreo y comparación de precios en supermercados locales',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Catalog', 'Catálogo de productos normalizados')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`API-Gateway corriendo en http://localhost:${port}`);
  logger.log(`Swagger disponible en http://localhost:${port}/api/docs`);
}
bootstrap();
