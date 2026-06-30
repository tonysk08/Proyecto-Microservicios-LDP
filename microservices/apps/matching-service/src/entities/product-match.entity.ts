import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

/**
 * Equivalencia entre un producto crudo y uno normalizado del catálogo.
 * Referencias LÓGICAS (sin FK cross-service).
 *
 * `rawProductId` guarda la referencia lógica del producto crudo
 * (`${supermarketId}:${rawName}`), ya que el matching no tiene el id físico
 * de catalog_raw_products. Único por esa referencia (idempotencia).
 */
@Unique(['rawProductId'])
@Index(['catalogProductId'])
@Index(['confidenceScore'])
@Entity({ name: 'product_matches', schema: 'matching' })
export class ProductMatchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'raw_product_id' })
  rawProductId: string;

  @Column({ name: 'catalog_product_id' })
  catalogProductId: string;

  @Column('float', { name: 'confidence_score' })
  confidenceScore: number; // 0.0 - 1.0

  @Column({ name: 'match_method', length: 20, default: 'auto' })
  matchMethod: string; // 'auto' | 'fuzzy' | 'manual'

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'matched_at' })
  matchedAt: Date;
}
