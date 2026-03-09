/**
 * PW-041-D1 | Хук для раздела «Хранилище».
 * Пока на mock-данных. PW-041-D2 заменит моки на реальные API-вызовы.
 */

import { useCallback, useEffect, useState } from 'react';
import type { StorageInfo, StorageTestResult } from './storage.types';

// ── Mock-данные (будут заменены на API в PW-041-D2) ──────────────────────────

const MOCK_STORAGE_INFO: StorageInfo = {
  backend: 's3',
  config: {
    maxUploadImageMb: 20,
    maxUploadOtherMb: 50,
    uploadDir: null,
    bucket: 'pw-media',
    region: 'ru-central-1',
    endpoint: 'https://s3.cloud.ru',
    publicEndpoint: 'https://global.s3.cloud.ru',
  },
  health: {
    connected: true,
    latencyMs: 47,
    error: null,
  },
  stats: {
    mediaFiles: 0,
    mediaSize: 0,
    avatarsCount: 1,
    byType: {},
  },
  sync: {
    localOnly: 2,
    s3Only: 0,
    synced: 0,
    lastSyncAt: null,
  },
};

const MOCK_TEST_RESULT: StorageTestResult = {
  success: true,
  steps: [
    { name: 'write', success: true, latencyMs: 68, error: null },
    { name: 'read', success: true, latencyMs: 23, error: null },
    { name: 'delete', success: true, latencyMs: 31, error: null },
  ],
  totalMs: 122,
};

// ── Хук ──────────────────────────────────────────────────────────────────────

export function useStorageInfo() {
  const [info, setInfo] = useState<StorageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [testResult, setTestResult] = useState<StorageTestResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Загрузка информации о хранилище
  const loadInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO PW-041-D2: заменить на adminGetStorageInfo()
      await new Promise(resolve => setTimeout(resolve, 600));
      setInfo(MOCK_STORAGE_INFO);
    } catch {
      setError('Не удалось загрузить информацию о хранилище');
    } finally {
      setLoading(false);
    }
  }, []);

  // Тест подключения
  const runTest = useCallback(async () => {
    setTesting(true);
    setTestResult(null);
    try {
      // TODO PW-041-D2: заменить на adminTestStorage()
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTestResult(MOCK_TEST_RESULT);
    } catch {
      setTestResult({
        success: false,
        steps: [],
        totalMs: 0,
      });
    } finally {
      setTesting(false);
    }
  }, []);

  // Сохранение лимитов загрузки
  const [savingLimits, setSavingLimits] = useState(false);

  const saveLimits = useCallback(async (imageMb: number, otherMb: number) => {
    setSavingLimits(true);
    try {
      // TODO PW-041-D2: заменить на adminUpdateStorageLimits()
      await new Promise(resolve => setTimeout(resolve, 500));
      setInfo(prev =>
        prev
          ? {
              ...prev,
              config: {
                ...prev.config,
                maxUploadImageMb: imageMb,
                maxUploadOtherMb: otherMb,
              },
            }
          : prev
      );
    } finally {
      setSavingLimits(false);
    }
  }, []);

  // Ручная синхронизация
  const runSync = useCallback(async () => {
    setSyncing(true);
    try {
      // TODO PW-041-D2: заменить на adminRunStorageSync()
      await new Promise(resolve => setTimeout(resolve, 2000));
      // После синхронизации обновляем данные
      setInfo(prev =>
        prev
          ? {
              ...prev,
              sync: {
                localOnly: 0,
                s3Only: 0,
                synced:
                  prev.sync.localOnly + prev.sync.s3Only + prev.sync.synced,
                lastSyncAt: new Date().toISOString(),
              },
            }
          : prev
      );
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return {
    info,
    loading,
    error,
    testResult,
    testing,
    syncing,
    savingLimits,
    runTest,
    runSync,
    saveLimits,
    refresh: loadInfo,
  };
}
