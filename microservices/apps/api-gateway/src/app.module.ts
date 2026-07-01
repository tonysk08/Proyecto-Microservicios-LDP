import { Module } from '@nestjs/common';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { CatalogModule } from './catalog/catalog.module';
import { ScrapingModule } from './scraping/scraping.module';
import { PricingModule } from './pricing/pricing.module';
import { HealthController } from './health/health.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        'apps/api-gateway/.env',
        '.env',
      ],
    }),
    ClientsModule.registerAsync([
      {
        name: 'CATALOG_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: 'catalog_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      }
    ]),
        ClientsModule.registerAsync([
      {
        name: 'PRICE_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: 'price_queue',
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    CatalogModule,
    ScrapingModule,
    PricingModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
