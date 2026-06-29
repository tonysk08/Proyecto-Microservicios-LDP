import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Carga inicial del catálogo (datos reales portados de los antiguos
 * init/04 e init/05). Se omiten las filas de prueba ("Elminable", "Undefiend")
 * que violaban el nuevo UNIQUE(supermarket, raw_name), y el campo lastPrice
 * (los precios son dominio del pricing-service).
 *
 * Idempotente: ON CONFLICT DO NOTHING.
 */
export class SeedCatalog1700000000001 implements MigrationInterface {
  name = 'SeedCatalog1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "catalog"."catalog_products"
        ("id", "name", "brand", "category", "presentation", "unit", "isActive")
      VALUES
        ('6fe9ee71-f8f3-49ec-ade2-a1390a214f33', 'arroz especial', 'pelin', 'granos', '2.27', 'kg', true),
        ('ddfcac57-9bc8-434b-82d9-527b1ded764a', 'ARROZ SSISIMO ESPECIAL', 'ARROSSISIMO', 'granos', '2', 'kg', true),
        ('99404b70-2f10-4f86-abe5-e37255dd5c0f', 'leche entera', 'panalat', 'Lácteos', '946', 'ml', true),
        ('f5d6ca14-9525-4308-bab4-3dc0368ae65e', 'leche entera', 'bonlac', 'Lácteos', '946', 'ml', true),
        ('68156813-fc96-46d6-83f1-0e0f43ba9c0d', 'leche entera', 'la chiricana', 'Lácteos', '946', 'ml', true),
        ('94c17880-1703-4648-a9dc-886773b0e8e3', 'leche entera', 'Nevada', 'Lácteos', '946', 'ml', true),
        ('033b9c57-90c1-4eb2-a18e-96bf1595ad8b', 'leche entera', 'estrella azul', 'Lácteos', '946', 'ml', true),
        ('d840e8d5-7ccc-4950-9c3c-4a03b1fc9085', 'leche entera roscable', 'bonlac', 'Lácteos', '946', 'ml', true)
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO "catalog"."catalog_raw_products"
        ("id", "supermarket", "raw_name", "raw_brand", "url", "status", "normalized_product_id")
      VALUES
        ('e189bd8c-2bba-4c12-aa50-53fcf95d4b1e', 'Super Carnes', 'ARROZ 2.27 KG ESPECIAL PELIN', 'PELIN', 'https://supercarnes.com/albrook/arroz-227-kg-especial-pelin-7451084770090', 'pending', '6fe9ee71-f8f3-49ec-ade2-a1390a214f33'),
        ('01f52165-bd7b-4406-a567-4ce31a57037e', 'Super Carnes', 'ARROSSISIMO ESPECIAL 2 KG', 'ARROSSISIMO', 'https://supercarnes.com/albrook/arrossisimo-especial-2-kg-7451106200116', 'pending', 'ddfcac57-9bc8-434b-82d9-527b1ded764a'),
        ('67603d2c-5074-4081-848a-5b4699e47b45', 'Super Carnes', 'LECHE ENTERA PANALAT 946ML', 'PANALAT', 'https://supercarnes.com/albrook/leche-entera-panalat-946ml-2022000001724', 'pending', '99404b70-2f10-4f86-abe5-e37255dd5c0f'),
        ('bb5bb76d-cb1d-4fde-a8b6-8736b8a94bb9', 'Super Carnes', 'LECHE ENTERA BONLAC 946 ML', 'BONLAC', 'https://supercarnes.com/albrook/leche-entera-bonlac-946-ml-012157301022', 'pending', 'f5d6ca14-9525-4308-bab4-3dc0368ae65e'),
        ('6550a356-4427-4bc7-ad8d-6bc9ebf06a8e', 'Super Carnes', 'LECHE BONLAC ENTERA 946 ML', 'BONLAC', 'https://supercarnes.com/albrook/leche-bonlac-entera-946-ml-012157211390', 'pending', 'd840e8d5-7ccc-4950-9c3c-4a03b1fc9085'),
        ('e0e52aea-37c0-449e-a387-9d31306eb18c', 'Super Carnes', 'LECHE LA CHIRICANA 946 ML', 'LA CHIRICANA', 'https://supercarnes.com/albrook/leche-la-chiricana-946-ml-7452096901588', 'pending', '68156813-fc96-46d6-83f1-0e0f43ba9c0d'),
        ('8dc89f80-f9ae-4dec-96dd-6cafc7159ebb', 'Super Carnes', 'LECHE D/ORO ENTERA ESTRELLA AZUL 946 ML', 'ESTRELLA AZUL', 'https://supercarnes.com/albrook/leche-doro-entera-estrella-azul-946-ml-088209013366', 'pending', '033b9c57-90c1-4eb2-a18e-96bf1595ad8b'),
        ('8beba282-2698-4a98-bd93-43a7a72e42d2', 'Super Carnes', 'NEVADA ENTERA NACIONAL 1 L', 'ESTRELLA AZUL', 'https://supercarnes.com/albrook/nevada-entera-nacional-1-l-743337100103', 'pending', '94c17880-1703-4648-a9dc-886773b0e8e3')
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "catalog"."catalog_raw_products"`);
    await queryRunner.query(`DELETE FROM "catalog"."catalog_products"`);
  }
}
