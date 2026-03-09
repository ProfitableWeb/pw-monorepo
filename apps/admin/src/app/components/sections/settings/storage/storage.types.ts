/**
 * PW-041-D1 | Типы для раздела «Хранилище» в настройках.
 */

export interface StorageConfig {
  maxUploadImageMb: number;
  maxUploadOtherMb: number;
  /** Только local */
  uploadDir: string | null;
  /** Только s3 */
  bucket: string | null;
  region: string | null;
  endpoint: string | null;
  publicEndpoint: string | null;
}

export interface StorageHealth {
  connected: boolean;
  latencyMs: number | null;
  error: string | null;
}

export interface StorageStats {
  mediaFiles: number;
  /** Байты */
  mediaSize: number;
  avatarsCount: number;
  byType: Record<string, number>;
}

export interface StorageSyncInfo {
  /** Файлов только на локальном диске */
  localOnly: number;
  /** Файлов только в S3 */
  s3Only: number;
  /** Файлов в обоих хранилищах */
  synced: number;
  /** Последняя синхронизация (ISO) */
  lastSyncAt: string | null;
}

export interface StorageInfo {
  backend: 'local' | 's3';
  config: StorageConfig;
  health: StorageHealth;
  stats: StorageStats;
  sync: StorageSyncInfo;
}

export interface StorageTestStep {
  name: string;
  success: boolean;
  latencyMs: number;
  error: string | null;
}

export interface StorageTestResult {
  success: boolean;
  steps: StorageTestStep[];
  totalMs: number;
}
