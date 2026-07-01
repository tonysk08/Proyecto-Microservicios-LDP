import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Seed de precios: porta los precios (lastPrice) que vivían en catalog_raw_products
 * a su dominio correcto. `catalog_product_id` referencia los productos del catálogo
 * (mismos UUIDs que el seed del catalog-service); supermercado "Super Carnes".
 * Idempotente.
 */
export class SeedPricing1700000000101 implements MigrationInterface {
  name = 'SeedPricing1700000000101';

  private readonly rows: Array<[string, number, string]> = [
    // [catalogProductId, price, sourceUrl]
    ['6fe9ee71-f8f3-49ec-ade2-a1390a214f33', 3.85, 'https://supercarnes.com/albrook/arroz-227-kg-especial-pelin-7451084770090'],
    ['ddfcac57-9bc8-434b-82d9-527b1ded764a', 3.67, 'https://supercarnes.com/albrook/arrossisimo-especial-2-kg-7451106200116'],
    ['99404b70-2f10-4f86-abe5-e37255dd5c0f', 1.68, 'https://supercarnes.com/albrook/leche-entera-panalat-946ml-2022000001724'],
    ['f5d6ca14-9525-4308-bab4-3dc0368ae65e', 1.74, 'https://supercarnes.com/albrook/leche-entera-bonlac-946-ml-012157301022'],
    ['d840e8d5-7ccc-4950-9c3c-4a03b1fc9085', 1.84, 'https://supercarnes.com/albrook/leche-bonlac-entera-946-ml-012157211390'],
    ['68156813-fc96-46d6-83f1-0e0f43ba9c0d', 1.79, 'https://supercarnes.com/albrook/leche-la-chiricana-946-ml-7452096901588'],
    ['033b9c57-90c1-4eb2-a18e-96bf1595ad8b', 1.69, 'https://supercarnes.com/albrook/leche-doro-entera-estrella-azul-946-ml-088209013366'],
    ['94c17880-1703-4648-a9dc-886773b0e8e3', 2.05, 'https://supercarnes.com/albrook/nevada-entera-nacional-1-l-743337100103'],
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    const supermarket = 'Super Carnes';
    for (const [productId, price, url] of this.rows) {
      await queryRunner.query(
        `INSERT INTO "pricing"."price_records"
           ("catalog_product_id", "supermarket_id", "price", "currency", "source_url", "scraped_at")
         VALUES ($1, $2, $3, 'USD', $4, now())`,
        [productId, supermarket, price, url],
      );
      await queryRunner.query(
        `INSERT INTO "pricing"."price_snapshots"
           ("catalog_product_id", "supermarket_id", "current_price", "currency")
         VALUES ($1, $2, $3, 'USD')
         ON CONFLICT ("catalog_product_id", "supermarket_id") DO NOTHING`,
        [productId, supermarket, price],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "pricing"."price_snapshots"`);
    await queryRunner.query(`DELETE FROM "pricing"."price_records"`);
  }
}
