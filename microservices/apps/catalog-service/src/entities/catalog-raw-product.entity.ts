import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CatalogProductEntity } from './catalog-product.entity';

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

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  lastPrice: number;

  @Column({ nullable: true })
  url: string; // Link al producto en la web del súper

  @Column({ default: 'pending' })
  status: string; // 'pending', 'matched', 'rejected'

  @ManyToOne(() => CatalogProductEntity, (product) => product.rawItems, { nullable: true })
  @JoinColumn({ name: 'normalized_product_id' })
  normalizedProduct: CatalogProductEntity;

  @CreateDateColumn()
  scrapedAt: Date;
}