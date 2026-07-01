import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adapta el modelo de precios para registrar precios scrapeados antes de que exista
 * el match a un producto del catálogo:
 *  - `catalog_product_id` pasa a NULLABLE (el matching lo rellenará después).
 *  - se agrega `raw_name` (identidad del producto tal cual lo trajo el scraper).
 *  - el snapshot pasa a ser único por (supermarket_id, raw_name).
 */
export class AddRawRefToPricing1700000000102 implements MigrationInterface {
  name = 'AddRawRefToPricing1700000000102';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // price_records
    await queryRunner.query(
      `ALTER TABLE "pricing"."price_records" ALTER COLUMN "catalog_product_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing"."price_records" ADD COLUMN "raw_name" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_price_records_raw_name" ON "pricing"."price_records" ("supermarket_id", "raw_name")`,
    );

    // price_snapshots
    await queryRunner.query(
      `ALTER TABLE "pricing"."price_snapshots" ALTER COLUMN "catalog_product_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing"."price_snapshots" ADD COLUMN "raw_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing"."price_snapshots" DROP CONSTRAINT "UQ_price_snapshots_product_supermarket"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing"."price_snapshots" ADD CONSTRAINT "UQ_price_snapshots_supermarket_raw_name" UNIQUE ("supermarket_id", "raw_name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pricing"."price_snapshots" DROP CONSTRAINT "UQ_price_snapshots_supermarket_raw_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing"."price_snapshots" ADD CONSTRAINT "UQ_price_snapshots_product_supermarket" UNIQUE ("catalog_product_id", "supermarket_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing"."price_snapshots" DROP COLUMN "raw_name"`,
    );
    await queryRunner.query(
      `DROP INDEX "pricing"."IDX_price_records_raw_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing"."price_records" DROP COLUMN "raw_name"`,
    );
  }
}
