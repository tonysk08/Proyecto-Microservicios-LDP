import { NestFactory } from '@nestjs/core';
import { CatalogServiceModule } from './catalog-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CatalogServiceModule);
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Catalog-Service is running on port ${process.env.PORT}`);
}
bootstrap();
