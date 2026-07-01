import { BaseEvent } from './base.event';

export interface PriceCreatedPayload {
  catalogProductId: string;
  supermarketId: string;
  price: number;
  /** ISO 4217, por defecto 'USD'. */
  currency: string;
  unit?: string;
  /** ISO 8601 */
  scrapedAt: string;
  sourceUrl?: string;
}
export type PriceCreatedEvent = BaseEvent<'price.created', PriceCreatedPayload>;

export interface PriceUpdatedPayload {
  catalogProductId: string;
  supermarketId: string;
  previousPrice: number;
  currentPrice: number;
  currency: string;
}
export type PriceUpdatedEvent = BaseEvent<'price.updated', PriceUpdatedPayload>;
