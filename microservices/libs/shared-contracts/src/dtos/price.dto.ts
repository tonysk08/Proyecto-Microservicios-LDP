import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

/**
 * Precio de un producto normalizado en un supermercado dado.
 */
export class PriceDto {
  @IsString()
  catalogProductId: string;

  @IsString()
  supermarketId: string;

  @IsNumber()
  @Min(0)
  price: number;

  /** Código ISO 4217. Panamá usa USD. */
  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  sourceUrl?: string;

  /** ISO 8601 */
  @IsOptional()
  @IsString()
  scrapedAt?: string;
}
