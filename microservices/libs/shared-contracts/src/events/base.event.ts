/**
 * Tipos de evento del sistema (routing keys lógicas).
 * Son los 9 eventos mínimos definidos para la arquitectura event-driven.
 */
export const EVENT_TYPES = {
  SCRAPING_REQUESTED: 'scraping.requested',
  SCRAPING_STARTED: 'scraping.started',
  SCRAPING_COMPLETED: 'scraping.completed',
  SCRAPING_FAILED: 'scraping.failed',
  PRODUCT_NORMALIZED: 'product.normalized',
  PRICE_CREATED: 'price.created',
  PRICE_UPDATED: 'price.updated',
  QUOTE_GENERATED: 'quote.generated',
  AUDIT_CREATED: 'audit.created',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

/**
 * Envoltura común de todo evento del sistema.
 * - `eventId`: UUID único del evento.
 * - `eventType`: tipo/routing key (ver EVENT_TYPES).
 * - `timestamp`: ISO 8601.
 * - `correlationId`: para tracing distribuido (mismo id a lo largo de un flujo).
 * - `payload`: datos específicos del evento.
 */
export interface BaseEvent<TType extends EventType, TPayload> {
  eventId: string;
  eventType: TType;
  timestamp: string;
  correlationId: string;
  payload: TPayload;
}
