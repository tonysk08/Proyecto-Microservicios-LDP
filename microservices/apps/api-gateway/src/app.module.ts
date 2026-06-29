import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatalogModule } from './catalog/catalog.module';
import { ScrapingModule } from './scraping/scraping.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
