import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { PriceRecordEntity } from './entities/price-record.entity';
import { PriceSnapshotEntity } from './entities/price-snapshot.entity';
import { InitPricingSchema1700000000100 } from './migrations/1700000000100-InitPricingSchema';
import { SeedPricing1700000000101 } from './migrations/1700000000101-SeedPricing';

// Fuente de datos para el CLI de TypeORM (generar/ejecutar migraciones).
config({ path: 'apps/price-service/.env' });

export default new DataSource({
  type: 'postgres',
  host: process.env.PRICE_DB_HOST,
  port: Number(process.env.PRICE_DB_PORT),
  username: process.env.PRICE_DB_USER,
  password: process.env.PRICE_DB_PASSWORD,
  database: process.env.PRICE_DB_NAME,
  schema: process.env.PRICE_DB_SCHEMA,
  entities: [PriceRecordEntity, PriceSnapshotEntity],
  migrations: [InitPricingSchema1700000000100, SeedPricing1700000000101],
});
