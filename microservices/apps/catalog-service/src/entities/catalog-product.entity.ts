import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CatalogRawProductEntity } from './catalog-raw-product.entity';

@Entity({ name: 'catalog_products', schema: 'catalog' })
export class CatalogProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string; // Ej: "Leche Entera"

  @Column({ length: 100, nullable: true })
  brand: string; // Ej: "Estrella Azul"

  @Column({ length: 100, nullable: true })
  category: string; // Ej: "Lácteos"

  @Column({ length: 50, nullable: true })
  presentation: string; // Ej: "1 Litro"

  @Column({ length: 20, nullable: true })
  unit: string; // Ej: "LT"

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => CatalogRawProductEntity, (raw) => raw.normalizedProduct)
  rawItems: CatalogRawProductEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
