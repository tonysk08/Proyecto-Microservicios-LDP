import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceServiceController } from './price-service.controller';
import { PriceServiceService } from './price-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        'apps/price-service/.env',
        '.env',
      ],
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
        synchronize: true,  //cambiar a false en producción
      }),
    }),
  ],
  controllers: [PriceServiceController],
  providers: [PriceServiceService],
})
export class PriceServiceModule {}
