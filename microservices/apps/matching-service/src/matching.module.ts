import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqPublisherService } from '@app/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { ProductMatchEntity } from './entities/product-match.entity';
import { InitMatchingSchema1700000000200 } from './migrations/1700000000200-InitMatchingSchema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/matching-service/.env', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('MATCHING_DB_HOST'),
        port: Number(configService.get<string>('MATCHING_DB_PORT')),
        username: configService.get<string>('MATCHING_DB_USER'),
        password: configService.get<string>('MATCHING_DB_PASSWORD'),
        database: configService.get<string>('MATCHING_DB_NAME'),
        schema: configService.get<string>('MATCHING_DB_SCHEMA'),
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: true,
        migrations: [InitMatchingSchema1700000000200],
      }),
    }),
    TypeOrmModule.forFeature([ProductMatchEntity]),
    ClientsModule.registerAsync([
      {
        name: 'CATALOG_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: configService.getOrThrow<string>('CATALOG_QUEUE'),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [MatchingController],
  providers: [MatchingService, RmqPublisherService],
})
export class MatchingModule {}
