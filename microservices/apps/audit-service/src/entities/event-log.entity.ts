import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * Registro centralizado de eventos del sistema (bd_logs / schema audit).
 * El audit-service consume `#` de los exchanges y persiste aquí.
 *
 * NOTA: esta entidad define el modelo de datos de bd_logs (LDP-044). Su
 * migración y wiring se realizarán al scaffoldear el audit-service (LDP-100).
 */
@Index(['eventType'])
@Index(['correlationId'])
@Index(['createdAt'])
@Entity({ name: 'event_logs', schema: 'audit' })
export class EventLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_type', length: 100 })
  eventType: string; // 'scraping.completed', 'price.created', ...

  @Column({ name: 'correlation_id', nullable: true })
  correlationId: string;

  @Column({ name: 'service_name', length: 50 })
  serviceName: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, unknown>;

  @Column({ length: 20, default: 'info' })
  level: string; // 'info' | 'warn' | 'error'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
