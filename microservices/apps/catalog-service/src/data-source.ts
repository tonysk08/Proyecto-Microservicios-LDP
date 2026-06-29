import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { CatalogProductEntity } from './entities/catalog-product.entity';
import { CatalogRawProductEntity } from './entities/catalog-raw-product.entity';
import { InitCatalogSchema1700000000000 } from './migrations/1700000000000-InitCatalogSchema';
import { SeedCatalog1700000000001 } from './migrations/1700000000001-SeedCatalog';

// Fuente de datos para el CLI de TypeORM (generar/ejecutar migraciones).
config({ path: 'apps/catalog-service/.env' });

export default new DataSource({
  type: 'postgres',
  host: process.env.CATALOG_DB_HOST,
  port: Number(process.env.CATALOG_DB_PORT),
  username: process.env.CATALOG_DB_USER,
  password: process.env.CATALOG_DB_PASSWORD,
  database: process.env.CATALOG_DB_NAME,
  schema: process.env.CATALOG_DB_SCHEMA,
  entities: [CatalogProductEntity, CatalogRawProductEntity],
  migrations: [InitCatalogSchema1700000000000, SeedCatalog1700000000001],
});
