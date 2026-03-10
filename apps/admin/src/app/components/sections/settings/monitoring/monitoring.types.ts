/**
 * PW-042-D1 | Типы для раздела «Мониторинг» в настройках.
 */

// ---------------------------------------------------------------------------
// System Health (таб «Система»)
// ---------------------------------------------------------------------------

export interface DiskInfo {
  totalGb: number;
  usedGb: number;
  percent: number;
}

export interface MemoryInfo {
  totalGb: number;
  usedGb: number;
  percent: number;
}

export interface ServiceStatus {
  name: 'api' | 'db' | 'storage';
  connected: boolean;
  latencyMs: number | null;
  error: string | null;
}

export interface SystemHealth {
  status: 'ok' | 'degraded' | 'down';
  uptimeSeconds: number;
  version: string;
  pythonVersion: string;
  cpuPercent: number;
  disk: DiskInfo;
  memory: MemoryInfo;
  services: ServiceStatus[];
  errors24h: number;
}

// ---------------------------------------------------------------------------
// Error Log (таб «Ошибки»)
// ---------------------------------------------------------------------------

export type ErrorLevel = 'warning' | 'error' | 'critical';

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  level: ErrorLevel;
  event: string;
  message: string;
  traceback: string | null;
  requestMethod: string | null;
  requestPath: string | null;
  requestId: string | null;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  statusCode: number | null;
  context: Record<string, unknown> | null;
  resolved: boolean;
}

export interface ErrorStats {
  last24h: number;
  last7d: number;
  last30d: number;
}

// ---------------------------------------------------------------------------
// Audit Log (таб «Аудит»)
// ---------------------------------------------------------------------------

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  changes: Record<string, { old: unknown; new: unknown }> | null;
  requestId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
}

// ---------------------------------------------------------------------------
// Фильтры и пагинация
// ---------------------------------------------------------------------------

export interface ErrorFilters {
  level: ErrorLevel | null;
  resolved: boolean | null;
  dateRange: 'all' | '24h' | '7d' | '30d';
}

export interface AuditFilters {
  action: string | null;
  userId: string | null;
  dateRange: 'all' | '24h' | '7d' | '30d';
}

export interface LoadMoreState {
  /** Сколько записей сейчас отображается */
  visible: number;
  /** Сколько загружать за одно нажатие */
  perPage: number;
}
