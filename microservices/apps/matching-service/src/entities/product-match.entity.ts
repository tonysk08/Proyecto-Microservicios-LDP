import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * Equivalencia entre un producto crudo (catalog_raw_products) y uno normalizado
 * (catalog_products). Referencias LÓGICAS (sin FK cross-service).
 *
 * NOTA: esta entidad define el modelo de datos de bd_matching (LDP-044). Su
 * migración y wiring se realizarán al scaffoldear el matching-service (LDP-060).
 */
@Index(['rawProductId'])
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
