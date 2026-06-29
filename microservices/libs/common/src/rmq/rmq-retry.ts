import { RmqContext } from '@nestjs/microservices';

/** Reintentos por defecto antes de enviar el mensaje a la DLQ. */
export const DEFAULT_MAX_RETRIES = 3;

/**
 * Backoff exponencial con tope (para el patrón de retry-queue con TTL).
 * attempt=1 → base; attempt=2 → base*2; ... acotado a maxMs.
 */
export function computeBackoffMs(
  attempt: number,
  baseMs = 1000,
  maxMs = 30000,
): number {
  return Math.min(maxMs, baseMs * 2 ** Math.max(0, attempt - 1));
}

/**
 * Nº de veces que el mensaje ya fue "dead-lettered" (header `x-death` de RabbitMQ).
 * Útil para decidir si reintentar o descartar a la DLQ.
 */
export function getDeathCount(context: RmqContext): number {
  const message = context.getMessage() as {
    properties?: { headers?: Record<string, unknown> };
  };
  const xDeath = message?.properties?.headers?.['x-death'] as
    | Array<{ count?: number }>
    | undefined;
  return Array.isArray(xDeath) && xDeath[0]?.count ? Number(xDeath[0].count) : 0;
}

/**
 * Procesa un mensaje de un consumidor de eventos con **ack manual** (`noAck:false`):
 *  - éxito  → `ack` (el mensaje se confirma y elimina de la cola).
 *  - fallo  → `nack` sin requeue → el mensaje cae a la DLQ configurada en la cola
 *             (`x-dead-letter-exchange`, ver rabbitmq/definitions.json).
 *
 * Evita el anti-patrón de requeue inmediato (hot-loop). El reintento con backoff
 * se implementará con una retry-queue + TTL (ver EVENT_ARCHITECTURE.md §Resiliencia).
 *
 * Uso en un consumidor:
 * ```ts
 * @EventPattern('scraping.completed')
 * async handle(@Payload() evt, @Ctx() ctx: RmqContext) {
 *   await consumeWithDlq(ctx, async () => { ...persistir... });
 * }
 * ```
 */
export async function consumeWithDlq(
  context: RmqContext,
  handler: () => Promise<void>,
): Promise<void> {
  const channel = context.getChannelRef();
  const message = context.getMessage();
  try {
    await handler();
    channel.ack(message);
  } catch {
    // Sin requeue → la cola enruta el mensaje a su DLQ vía x-dead-letter-exchange.
    channel.nack(message, false, false);
  }
}
