import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * Historial inmutable de precios: una fila por cada precio observado.
 * Nunca se actualiza, solo se inserta.
 * `catalogProductId` es una referencia LÓGICA a catalog (sin FK cross-service).
 */
@Index(['catalogProductId'])
@Index(['supermarketId'])
@Entity({ name: 'price_records', schema: 'pricing' })
export class PriceRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'catalog_product_id' })
  catalogProductId: string;

  @Column({ name: 'supermarket_id', length: 50 })
  supermarketId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'source_url', nullable: true })
  sourceUrl: string;

  @Column({ name: 'scraped_at', type: 'timestamp' })
  scrapedAt: Date;

  @CreateDateColumn({ name: 'recorded_at' })
  recordedAt: Date;
}
