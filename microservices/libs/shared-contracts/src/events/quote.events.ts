import { BaseEvent } from './base.event';

export interface QuoteItem {
  catalogProductId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface QuoteBySupermarket {
  supermarketId: string;
  total: number;
  items: QuoteItem[];
}

export interface QuoteGeneratedPayload {
  quoteId: string;
  /** Supermercado con el total más económico. */
  cheapestSupermarketId: string;
  totalsBySupermarket: QuoteBySupermarket[];
}
export type QuoteGeneratedEvent = BaseEvent<
  'quote.generated',
  QuoteGeneratedPayload
>;
