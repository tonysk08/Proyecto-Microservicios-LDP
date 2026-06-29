import { BaseEvent } from './base.event';
import { RawProductDto } from '../dtos/raw-product.dto';

export type ScrapingPriority = 'low' | 'normal' | 'high';
export type ScrapingRequestedBy = 'scheduler' | 'api' | 'manual';

export interface ScrapingRequestedPayload {
  supermarketId: string;
  supermarketName?: string;
  targetUrl?: string;
  requestedBy: ScrapingRequestedBy;
  priority: ScrapingPriority;
}
export type ScrapingRequestedEvent = BaseEvent<
  'scraping.requested',
  ScrapingRequestedPayload
>;

export interface ScrapingStartedPayload {
  supermarketId: string;
  supermarketName?: string;
}
export type ScrapingStartedEvent = BaseEvent<
  'scraping.started',
  ScrapingStartedPayload
>;

export interface ScrapingCompletedPayload {
  supermarketId: string;
  supermarketName?: string;
  productsScraped: number;
  durationMs: number;
  rawProducts: RawProductDto[];
}
export type ScrapingCompletedEvent = BaseEvent<
  'scraping.completed',
  ScrapingCompletedPayload
>;

export interface ScrapingFailedPayload {
  supermarketId: string;
  reason: string;
  error: string;
  retryCount: number;
}
export type ScrapingFailedEvent = BaseEvent<
  'scraping.failed',
  ScrapingFailedPayload
>;
