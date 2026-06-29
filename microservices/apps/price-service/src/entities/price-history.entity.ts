import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity({ name: 'price_history', schema: 'pricing' })
export class PriceHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productId: string; // Referencia al catalog_products (sin FK cross-service)

  @Column({ length: 100 })
  supermarket: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ length: 10, nullable: true })
  currency: string; // USD, PAB, etc.

  @Column({ length: 500, nullable: true })
  url: string;

  @Column({ length: 50, nullable: true })
  status: string; // 'active', 'unavailable', 'out_of_stock'

  @CreateDateColumn()
  capturedAt: Date;
}