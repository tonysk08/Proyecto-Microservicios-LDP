import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Crea el esquema de auditoría (bd_logs / schema audit).
 * El esquema `audit` y la base ya existen (init/01).
 */
export class InitAuditSchema1700000000300 implements MigrationInterface {
  name = 'InitAuditSchema1700000000300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "audit"."event_logs" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "event_type" character varying(100) NOT NULL,
        "correlation_id" character varying,
        "service_name" character varying(50) NOT NULL,
        "payload" jsonb NOT NULL,
        "level" character varying(20) NOT NULL DEFAULT 'info',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_event_logs" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_event_logs_event_type" ON "audit"."event_logs" ("event_type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_event_logs_correlation_id" ON "audit"."event_logs" ("correlation_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_event_logs_created_at" ON "audit"."event_logs" ("created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "audit"."event_logs"`);
  }
}
