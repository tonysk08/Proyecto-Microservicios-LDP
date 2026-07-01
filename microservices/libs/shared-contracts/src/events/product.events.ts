import { BaseEvent } from './base.event';
import { ProductDto } from '../dtos/product.dto';

export interface ProductNormalizedPayload {
  rawProductId: string;
  catalogProductId: string;
  supermarketId: string;
  product: ProductDto;
  /** Confianza del matching 0.0 - 1.0 (1.0 = coincidencia exacta). */
  confidenceScore?: number;
}
export type ProductNormalizedEvent = BaseEvent<
  'product.normalized',
  ProductNormalizedPayload
>;
