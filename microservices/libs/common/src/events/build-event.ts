import { randomUUID } from 'crypto';
import { BaseEvent, EventType } from '@app/shared-contracts';

/**
 * Construye un evento del sistema con la envoltura estándar.
 * Genera `eventId` y `timestamp`; si no se pasa `correlationId`, crea uno nuevo
 * (inicio de un flujo). Reusar el mismo `correlationId` a lo largo de un flujo
 * permite tracing distribuido.
 */
export function buildEvent<TType extends EventType, TPayload>(
  eventType: TType,
  payload: TPayload,
  correlationId?: string,
): BaseEvent<TType, TPayload> {
  return {
    eventId: randomUUID(),
    eventType,
    timestamp: new Date().toISOString(),
    correlationId: correlationId ?? randomUUID(),
    payload,
  };
}
