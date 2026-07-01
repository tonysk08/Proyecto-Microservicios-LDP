import { Module } from '@nestjs/common';
import { CatalogServiceController } from './catalog-service.controller';
import { CatalogServiceService } from './catalog-service.service';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogProductEntity } from './entities/catalog-product.entity';
import { CatalogRawProductEntity } from './entities/catalog-raw-product.entity';
import { InitCatalogSchema1700000000000 } from './migrations/1700000000000-InitCatalogSchema';
import { SeedCatalog1700000000001 } from './migrations/1700000000001-SeedCatalog';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        'apps/catalog-service/.env',
        '.env',
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('CATALOG_DB_HOST'),
        port: Number(configService.get<string>('CATALOG_DB_PORT')),
        username: configService.get<string>('CATALOG_DB_USER'),
        password: configService.get<string>('CATALOG_DB_PASSWORD'),
        database: configService.get<string>('CATALOG_DB_NAME'),
        schema: configService.get<string>('CATALOG_DB_SCHEMA'),
        autoLoadEntities: true,
        synchronize: false, // el esquema lo gestionan las migraciones
        migrationsRun: true, // ejecuta migraciones pendientes al arrancar
        migrations: [InitCatalogSchema1700000000000, SeedCatalog1700000000001],
      }),
    }),
    TypeOrmModule.forFeature([CatalogProductEntity, CatalogRawProductEntity]),
  ],
  controllers: [CatalogServiceController],
  providers: [CatalogServiceService],
})
export class CatalogServiceModule {}
