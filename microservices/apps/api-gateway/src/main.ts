import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const server = app.getHttpServer();
  server.setTimeout(10000); // Establece el timeout a 10 segundos (en milisegundos)
  
  app.setGlobalPrefix('api');

  if(process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('API Gateway')
      .setDescription('API Gateway for managing microservices')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);

  console.log(`API-Gateway is running on port ${process.env.PORT}`);
}
bootstrap();
