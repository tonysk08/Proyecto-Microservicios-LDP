import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatalogModule } from './catalog/catalog.module';
import { ScrapingModule } from './scraping/scraping.module';
import { PricingModule } from './pricing/pricing.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        'apps/api-gateway/.env',
        '.env',
      ],
    }),
    CatalogModule,
    ScrapingModule,
    PricingModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
