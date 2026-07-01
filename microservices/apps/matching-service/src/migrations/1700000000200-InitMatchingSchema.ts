import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Crea el esquema de matching (bd_matching / schema matching).
 * El esquema `matching` y la base ya existen (init/01).
 */
export class InitMatchingSchema1700000000200 implements MigrationInterface {
  name = 'InitMatchingSchema1700000000200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "matching"."product_matches" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "raw_product_id" character varying NOT NULL,
        "catalog_product_id" uuid NOT NULL,
        "confidence_score" double precision NOT NULL,
        "match_method" character varying(20) NOT NULL DEFAULT 'auto',
        "is_active" boolean NOT NULL DEFAULT true,
        "matched_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_product_matches" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_product_matches_raw_product" UNIQUE ("raw_product_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_product_matches_catalog_product_id" ON "matching"."product_matches" ("catalog_product_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_matches_confidence" ON "matching"."product_matches" ("confidence_score")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS "matching"."product_matches"`,
    );
  }
}
