import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditConsumerService } from './audit-consumer.service';
import { EventLogEntity } from './entities/event-log.entity';
import { InitAuditSchema1700000000300 } from './migrations/1700000000300-InitAuditSchema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/audit-service/.env', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('LOGS_DB_HOST'),
        port: Number(configService.get<string>('LOGS_DB_PORT')),
        username: configService.get<string>('LOGS_DB_USER'),
        password: configService.get<string>('LOGS_DB_PASSWORD'),
        database: configService.get<string>('LOGS_DB_NAME'),
        schema: configService.get<string>('LOGS_DB_SCHEMA'),
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: true,
        migrations: [InitAuditSchema1700000000300],
      }),
    }),
    TypeOrmModule.forFeature([EventLogEntity]),
  ],
  providers: [AuditConsumerService],
})
export class AuditModule {}
