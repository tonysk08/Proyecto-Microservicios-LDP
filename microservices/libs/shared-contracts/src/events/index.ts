export * from './base.event';
export * from './scraping.events';
export * from './product.events';
export * from './price.events';
export * from './quote.events';
export * from './audit.events';

import {
  ScrapingRequestedEvent,
  ScrapingStartedEvent,
  ScrapingCompletedEvent,
  ScrapingFailedEvent,
} from './scraping.events';
import { ProductNormalizedEvent } from './product.events';
import { PriceCreatedEvent, PriceUpdatedEvent } from './price.events';
import { QuoteGeneratedEvent } from './quote.events';
import { AuditCreatedEvent } from './audit.events';

/** Unión de todos los eventos del sistema (útil para consumidores genéricos). */
export type SystemEvent =
  | ScrapingRequestedEvent
  | ScrapingStartedEvent
  | ScrapingCompletedEvent
  | ScrapingFailedEvent
  | ProductNormalizedEvent
  | PriceCreatedEvent
  | PriceUpdatedEvent
  | QuoteGeneratedEvent
  | AuditCreatedEvent;
