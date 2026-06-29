import { BaseEvent } from './base.event';

export type AuditLevel = 'info' | 'warn' | 'error';

export interface AuditCreatedPayload {
  /** Servicio que originó el log (ej. 'catalog-service'). */
  serviceName: string;
  /** Tipo de evento original que disparó la auditoría. */
  originalEventType: string;
  level: AuditLevel;
  message?: string;
  data?: Record<string, unknown>;
}
export type AuditCreatedEvent = BaseEvent<'audit.created', AuditCreatedPayload>;
