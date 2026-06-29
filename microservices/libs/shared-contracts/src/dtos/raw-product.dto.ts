import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

/**
 * Producto tal cual lo entrega un scraper, antes de normalizar.
 * Es el elemento de `ScrapingCompletedEvent.payload.rawProducts`.
 */
export class RawProductDto {
  @IsString()
  rawName: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  unit: string;

  @IsString()
  supermarketId: string;

  @IsOptional()
  @IsString()
  rawBrand?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  sourceUrl?: string;

  /** ISO 8601 */
  @IsOptional()
  @IsString()
  scrapedAt?: string;
}
