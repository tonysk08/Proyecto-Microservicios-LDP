import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqPublisherService } from '@app/common';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorService } from './orchestrator.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/scraper-orchestrator/.env', '.env'],
    }),
  ],
  controllers: [OrchestratorController],
  providers: [OrchestratorService, RmqPublisherService],
})
export class OrchestratorModule {}
