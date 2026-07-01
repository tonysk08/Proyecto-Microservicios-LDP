import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { RawProductStatus } from '@app/shared-contracts';
import { CatalogProductEntity } from './catalog-product.entity';

@Index(['supermarket'])
@Index(['status'])
@Unique(['supermarket', 'rawName'])
@Entity({ name: 'catalog_raw_products', schema: 'catalog' })
export class CatalogRawProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  supermarket: string; // Ej: "Super 99"

  @Column({ name: 'raw_name' })
  rawName: string; // El nombre tal cual lo trajo el scraper

  @Column({ name: 'raw_brand', nullable: true })
  rawBrand: string;

  @Column({ nullable: true })
  url: string; // Link al producto en la web del súper

  @Column({
    type: 'enum',
    enum: RawProductStatus,
    default: RawProductStatus.PENDING,
  })
  status: RawProductStatus;

  @ManyToOne(() => CatalogProductEntity, (product) => product.rawItems, {
    nullable: true,
  })
  @JoinColumn({ name: 'normalized_product_id' })
  normalizedProduct: CatalogProductEntity;

  @CreateDateColumn()
  scrapedAt: Date;
}
