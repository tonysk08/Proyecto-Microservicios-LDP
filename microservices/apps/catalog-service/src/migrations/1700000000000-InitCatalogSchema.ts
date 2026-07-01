import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Crea el esquema del catálogo (tablas, enum, índices, constraints).
 * Sustituye al antiguo init/03-init-catalogs-structures.sql.
 * El esquema `catalog` y la base ya existen (init/01).
 */
export class InitCatalogSchema1700000000000 implements MigrationInterface {
  name = 'InitCatalogSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enum de estado de matching (alineado con RawProductStatus de @app/shared-contracts)
    await queryRunner.query(`
      CREATE TYPE "catalog"."catalog_raw_products_status_enum" AS ENUM (
        'pending', 'matched', 'rejected', 'duplicate'
      )
    `);

    // Tabla de productos normalizados
    await queryRunner.query(`
      CREATE TABLE "catalog"."catalog_products" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(200) NOT NULL,
        "brand" character varying(100),
        "category" character varying(100),
        "presentation" character varying(50),
        "unit" character varying(20),
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_catalog_products" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_catalog_products_name_brand_presentation_unit"
          UNIQUE ("name", "brand", "presentation", "unit")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_products_name_brand_presentation" ON "catalog"."catalog_products" ("name", "brand", "presentation")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_products_category" ON "catalog"."catalog_products" ("category")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_products_isActive" ON "catalog"."catalog_products" ("isActive")`,
    );

    // Tabla de productos crudos (scraping), sin lastPrice (boundary: precios → pricing)
    await queryRunner.query(`
      CREATE TABLE "catalog"."catalog_raw_products" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "supermarket" character varying NOT NULL,
        "raw_name" character varying NOT NULL,
        "raw_brand" character varying,
        "url" character varying,
        "status" "catalog"."catalog_raw_products_status_enum" NOT NULL DEFAULT 'pending',
        "scrapedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "normalized_product_id" uuid,
        CONSTRAINT "PK_catalog_raw_products" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_catalog_raw_products_supermarket_raw_name"
          UNIQUE ("supermarket", "raw_name"),
        CONSTRAINT "FK_catalog_raw_products_normalized_product"
          FOREIGN KEY ("normalized_product_id")
          REFERENCES "catalog"."catalog_products"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_raw_products_supermarket" ON "catalog"."catalog_raw_products" ("supermarket")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_raw_products_status" ON "catalog"."catalog_raw_products" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS "catalog"."catalog_raw_products"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "catalog"."catalog_products"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "catalog"."catalog_raw_products_status_enum"`,
    );
  }
}
