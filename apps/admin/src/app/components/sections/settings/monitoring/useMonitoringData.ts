/**
 * PW-042-B | Хук для раздела «Мониторинг».
 * Health — реальный API (PW-042-C). Ошибки — реальный API (PW-042-B). Аудит — моки (до PW-042-D).
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  SystemHealth,
  ErrorLogEntry,
  ErrorStats,
  AuditLogEntry,
  ErrorFilters,
  AuditFilters,
  LoadMoreState,
} from './monitoring.types';
import { MOCK_AUDIT_ENTRIES } from './monitoring.mocks';
import {
  adminGetSystemHealth,
  adminGetErrors,
  adminGetErrorStats,
  adminResolveError,
} from '@/lib/api-client';
import { DATE_RANGE_MS, DEFAULT_PER_PAGE } from './monitoring.utils';

/** Имитация задержки сети (для моков аудита) */
function delay(ms = 600): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Фильтрация по дате (для моков аудита) */
function matchesDateRange(timestamp: string, dateRange: string): boolean {
  if (dateRange === 'all') return true;
  const maxMs = DATE_RANGE_MS[dateRange];
  if (!maxMs) return true;
  return Date.now() - new Date(timestamp).getTime() <= maxMs;
}

export function useMonitoringData() {
  // --- Общее ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Система ---
  const [health, setHealth] = useState<SystemHealth | null>(null);

  // --- Ошибки (реальный API) ---
  const [errors, setErrors] = useState<ErrorLogEntry[]>([]);
  const [errorsTotal, setErrorsTotal] = useState(0);
  const [errorStats, setErrorStats] = useState<ErrorStats | null>(null);
  const [errorFilters, setErrorFilters] = useState<ErrorFilters>({
    level: null,
    resolved: null,
    dateRange: 'all',
  });
  const [errorLoadMore, setErrorLoadMore] = useState<LoadMoreState>({
    visible: DEFAULT_PER_PAGE,
    perPage: DEFAULT_PER_PAGE,
  });
  const [errorsLoading, setErrorsLoading] = useState(false);

  // --- Аудит (моки — до PW-042-D) ---
  const [audit, setAudit] = useState<AuditLogEntry[]>([]);
  const [auditFilters, setAuditFilters] = useState<AuditFilters>({
    action: null,
    userId: null,
    dateRange: 'all',
  });
  const [auditLoadMore, setAuditLoadMore] = useState<LoadMoreState>({
    visible: DEFAULT_PER_PAGE,
    perPage: DEFAULT_PER_PAGE,
  });

  // --- Загрузка ошибок (серверная фильтрация + пагинация) ---
  const fetchErrors = useCallback(
    async (
      filters: ErrorFilters,
      limit: number,
      offset: number,
      append: boolean
    ) => {
      setErrorsLoading(true);
      try {
        const result = await adminGetErrors({
          limit,
          offset,
          level: filters.level ?? undefined,
          resolved: filters.resolved ?? undefined,
          dateRange:
            filters.dateRange !== 'all' ? filters.dateRange : undefined,
        });
        if (append) {
          setErrors(prev => [...prev, ...result.data]);
        } else {
          setErrors(result.data);
        }
        setErrorsTotal(result.meta.total ?? 0);
      } catch {
        setError('Не удалось загрузить ошибки');
      } finally {
        setErrorsLoading(false);
      }
    },
    []
  );

  // --- Первоначальная загрузка ---
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Health — реальный API (PW-042-C)
      const healthData = await adminGetSystemHealth();
      setHealth(healthData as SystemHealth);

      // Ошибки — реальный API (PW-042-B)
      const [errorResult, stats] = await Promise.all([
        adminGetErrors({ limit: DEFAULT_PER_PAGE, offset: 0 }),
        adminGetErrorStats(),
      ]);
      setErrors(errorResult.data);
      setErrorsTotal(errorResult.meta.total ?? 0);
      setErrorStats(stats);
      setErrorLoadMore({
        visible: DEFAULT_PER_PAGE,
        perPage: DEFAULT_PER_PAGE,
      });
      setErrorFilters({ level: null, resolved: null, dateRange: 'all' });

      // Аудит — моки (до PW-042-D)
      await delay(200);
      setAudit(MOCK_AUDIT_ENTRIES);
    } catch {
      setError('Не удалось загрузить данные мониторинга');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // --- Фильтрация аудита (мемоизированная, клиентская — моки) ---
  const filteredAudit = useMemo(
    () =>
      audit.filter(a => {
        if (auditFilters.action && a.action !== auditFilters.action)
          return false;
        if (auditFilters.userId && a.userId !== auditFilters.userId)
          return false;
        return matchesDateRange(a.timestamp, auditFilters.dateRange);
      }),
    [audit, auditFilters]
  );

  const visibleAudit = useMemo(
    () => filteredAudit.slice(0, auditLoadMore.visible),
    [filteredAudit, auditLoadMore.visible]
  );

  // --- Уникальные значения для фильтров аудита ---
  const uniqueAuditActions = useMemo(() => {
    const set = new Set(audit.map(e => e.action));
    return Array.from(set).sort();
  }, [audit]);

  const uniqueAuditUsers = useMemo(() => {
    const map = new Map<string, string>();
    audit.forEach(e => {
      if (e.userId && e.userName) map.set(e.userId, e.userName);
    });
    return Array.from(map.entries());
  }, [audit]);

  // --- Действия: фильтры ошибок (серверная фильтрация) ---
  const handleSetErrorFilters = useCallback(
    (f: ErrorFilters) => {
      setErrorFilters(f);
      setErrorLoadMore(prev => ({ ...prev, visible: prev.perPage }));
      fetchErrors(f, errorLoadMore.perPage, 0, false);
    },
    [fetchErrors, errorLoadMore.perPage]
  );

  const handleSetAuditFilters = useCallback((f: AuditFilters) => {
    setAuditFilters(f);
    setAuditLoadMore(prev => ({ ...prev, visible: prev.perPage }));
  }, []);

  // --- Действия: load more ---
  const loadMoreErrors = useCallback(() => {
    const newVisible = errorLoadMore.visible + errorLoadMore.perPage;
    setErrorLoadMore(prev => ({ ...prev, visible: newVisible }));
    fetchErrors(errorFilters, errorLoadMore.perPage, errors.length, true);
  }, [errorLoadMore, errorFilters, errors.length, fetchErrors]);

  const loadMoreAudit = useCallback(() => {
    setAuditLoadMore(prev => ({
      ...prev,
      visible: prev.visible + prev.perPage,
    }));
  }, []);

  // --- Действия: изменение perPage ---
  const setErrorPerPage = useCallback(
    (perPage: number) => {
      setErrorLoadMore({ visible: perPage, perPage });
      fetchErrors(errorFilters, perPage, 0, false);
    },
    [errorFilters, fetchErrors]
  );

  const setAuditPerPage = useCallback((perPage: number) => {
    setAuditLoadMore({ visible: perPage, perPage });
  }, []);

  // --- Действия: resolve (реальный API) ---
  const resolveError = useCallback(async (id: string) => {
    try {
      await adminResolveError(id);
      setErrors(prev =>
        prev.map(e => (e.id === id ? { ...e, resolved: true } : e))
      );
    } catch {
      setError('Не удалось отметить ошибку как решённую');
    }
  }, []);

  return {
    // Общее
    loading: loading || errorsLoading,
    error,
    refresh: loadAll,

    // Система
    health,

    // Ошибки
    errors,
    errorsTotal,
    errorStats,
    errorFilters,
    setErrorFilters: handleSetErrorFilters,
    errorLoadMore,
    loadMoreErrors,
    setErrorPerPage,
    hasMoreErrors: errors.length < errorsTotal,
    resolveError,

    // Аудит
    audit: visibleAudit,
    auditTotal: filteredAudit.length,
    auditFilters,
    setAuditFilters: handleSetAuditFilters,
    auditLoadMore,
    loadMoreAudit,
    setAuditPerPage,
    hasMoreAudit: auditLoadMore.visible < filteredAudit.length,
    uniqueAuditActions,
    uniqueAuditUsers,
  };
}
