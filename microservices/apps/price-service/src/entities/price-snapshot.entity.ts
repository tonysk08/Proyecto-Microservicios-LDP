import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

/**
 * Último precio conocido por producto/supermercado (para queries rápidas
 * de comparación). Único por (catalogProductId, supermarketId).
 */
@Unique(['catalogProductId', 'supermarketId'])
@Index(['catalogProductId'])
@Index(['supermarketId'])
@Entity({ name: 'price_snapshots', schema: 'pricing' })
export class PriceSnapshotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'catalog_product_id' })
  catalogProductId: string;

  @Column({ name: 'supermarket_id', length: 50 })
  supermarketId: string;

  @Column('decimal', { name: 'current_price', precision: 10, scale: 2 })
  currentPrice: number;

  @Column('decimal', {
    name: 'previous_price',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  previousPrice: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
