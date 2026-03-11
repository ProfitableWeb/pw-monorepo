/**
 * PW-041-D2 | Хук для раздела «Хранилище».
 * Реальные API-вызовы вместо mock-данных.
 */

import { useCallback, useEffect, useState } from 'react';
import { adminGetStorageInfo, adminTestStorage } from '@/lib/api-client';
import type { StorageInfo, StorageTestResult } from './storage.types';

export function useStorageInfo() {
  const [info, setInfo] = useState<StorageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [testResult, setTestResult] = useState<StorageTestResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [syncing] = useState(false);

  // Загрузка информации о хранилище
  const loadInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetStorageInfo();
      setInfo(data);
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
      const result = await adminTestStorage();
      setTestResult(result);
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

  // Лимиты — read-only из env, runtime-обновление не поддерживается.

  // Синхронизация — пока не реализована (sync возвращает zeros).
  const runSync = useCallback(async () => {}, []);

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
    runTest,
    runSync,
    refresh: loadInfo,
  };
}
