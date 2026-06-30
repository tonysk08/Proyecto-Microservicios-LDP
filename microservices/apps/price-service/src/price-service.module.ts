import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqPublisherService } from '@app/common';
import { PriceServiceController } from './price-service.controller';
import { PriceServiceService } from './price-service.service';
import { PriceRecordEntity } from './entities/price-record.entity';
import { PriceSnapshotEntity } from './entities/price-snapshot.entity';
import { InitPricingSchema1700000000100 } from './migrations/1700000000100-InitPricingSchema';
import { SeedPricing1700000000101 } from './migrations/1700000000101-SeedPricing';
import { AddRawRefToPricing1700000000102 } from './migrations/1700000000102-AddRawRefToPricing';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/price-service/.env', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PRICE_DB_HOST'),
        port: Number(configService.get<string>('PRICE_DB_PORT')),
        username: configService.get<string>('PRICE_DB_USER'),
        password: configService.get<string>('PRICE_DB_PASSWORD'),
        database: configService.get<string>('PRICE_DB_NAME'),
        schema: configService.get<string>('PRICE_DB_SCHEMA'),
        autoLoadEntities: true,
        synchronize: false, // el esquema lo gestionan las migraciones
        migrationsRun: true,
        migrations: [
          InitPricingSchema1700000000100,
          SeedPricing1700000000101,
          AddRawRefToPricing1700000000102,
        ],
      }),
    }),
    TypeOrmModule.forFeature([PriceRecordEntity, PriceSnapshotEntity]),
  ],
  controllers: [PriceServiceController],
  providers: [PriceServiceService, RmqPublisherService],
})
export class PriceServiceModule {}
