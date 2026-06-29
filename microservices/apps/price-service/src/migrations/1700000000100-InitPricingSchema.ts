import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Crea el esquema de precios (bd_prices / schema pricing).
 * Referencias a catalog son lógicas (sin FK cross-service).
 * El esquema `pricing` y la base ya existen (init/01).
 */
export class InitPricingSchema1700000000100 implements MigrationInterface {
  name = 'InitPricingSchema1700000000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Historial inmutable de precios
    await queryRunner.query(`
      CREATE TABLE "pricing"."price_records" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "catalog_product_id" uuid NOT NULL,
        "supermarket_id" character varying(50) NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "currency" character varying(3) NOT NULL DEFAULT 'USD',
        "source_url" character varying,
        "scraped_at" TIMESTAMP NOT NULL,
        "recorded_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_price_records" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_price_records_catalog_product_id" ON "pricing"."price_records" ("catalog_product_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_price_records_supermarket_id" ON "pricing"."price_records" ("supermarket_id")`,
    );

    // Último precio conocido por producto/supermercado
    await queryRunner.query(`
      CREATE TABLE "pricing"."price_snapshots" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "catalog_product_id" uuid NOT NULL,
        "supermarket_id" character varying(50) NOT NULL,
        "current_price" numeric(10,2) NOT NULL,
        "previous_price" numeric(10,2),
        "currency" character varying(3) NOT NULL DEFAULT 'USD',
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_price_snapshots" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_price_snapshots_product_supermarket"
          UNIQUE ("catalog_product_id", "supermarket_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_price_snapshots_catalog_product_id" ON "pricing"."price_snapshots" ("catalog_product_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_price_snapshots_supermarket_id" ON "pricing"."price_snapshots" ("supermarket_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "pricing"."price_snapshots"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "pricing"."price_records"`);
  }
}
