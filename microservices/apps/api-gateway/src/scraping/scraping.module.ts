import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqPublisherService } from '@app/common';
import { ScrapingController } from './scraping.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ScrapingController],
  providers: [RmqPublisherService],
})
export class ScrapingModule {}
