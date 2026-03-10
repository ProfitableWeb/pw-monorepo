/**
 * PW-042-D2 | Хук для раздела «Мониторинг».
 * На моках — в D8 заменяется на реальные API-вызовы.
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
import {
  MOCK_SYSTEM_HEALTH,
  MOCK_ERROR_ENTRIES,
  MOCK_ERROR_STATS,
  MOCK_AUDIT_ENTRIES,
} from './monitoring.mocks';
import { DATE_RANGE_MS, DEFAULT_PER_PAGE } from './monitoring.utils';

/** Имитация задержки сети */
function delay(ms = 600): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Фильтрация по дате (общая для ошибок и аудита) */
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

  // --- Ошибки ---
  const [errors, setErrors] = useState<ErrorLogEntry[]>([]);
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

  // --- Аудит ---
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

  // --- Загрузка данных (mock) ---
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await delay();
      setHealth(MOCK_SYSTEM_HEALTH);
      setErrors(MOCK_ERROR_ENTRIES);
      setErrorStats(MOCK_ERROR_STATS);
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

  // --- Фильтрация ошибок (мемоизированная) ---
  const filteredErrors = useMemo(
    () =>
      errors.filter(e => {
        if (errorFilters.level && e.level !== errorFilters.level) return false;
        if (
          errorFilters.resolved !== null &&
          e.resolved !== errorFilters.resolved
        )
          return false;
        return matchesDateRange(e.timestamp, errorFilters.dateRange);
      }),
    [errors, errorFilters]
  );

  const visibleErrors = useMemo(
    () => filteredErrors.slice(0, errorLoadMore.visible),
    [filteredErrors, errorLoadMore.visible]
  );

  // --- Фильтрация аудита (мемоизированная) ---
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

  // --- Уникальные значения для фильтров (из ВСЕХ данных, не только видимых) ---
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

  // --- Действия: фильтры (сброс видимых при изменении) ---
  const handleSetErrorFilters = useCallback((f: ErrorFilters) => {
    setErrorFilters(f);
    setErrorLoadMore(prev => ({ ...prev, visible: prev.perPage }));
  }, []);

  const handleSetAuditFilters = useCallback((f: AuditFilters) => {
    setAuditFilters(f);
    setAuditLoadMore(prev => ({ ...prev, visible: prev.perPage }));
  }, []);

  // --- Действия: load more ---
  const loadMoreErrors = useCallback(() => {
    setErrorLoadMore(prev => ({
      ...prev,
      visible: prev.visible + prev.perPage,
    }));
  }, []);

  const loadMoreAudit = useCallback(() => {
    setAuditLoadMore(prev => ({
      ...prev,
      visible: prev.visible + prev.perPage,
    }));
  }, []);

  // --- Действия: изменение perPage ---
  const setErrorPerPage = useCallback((perPage: number) => {
    setErrorLoadMore({ visible: perPage, perPage });
  }, []);

  const setAuditPerPage = useCallback((perPage: number) => {
    setAuditLoadMore({ visible: perPage, perPage });
  }, []);

  // --- Действия: resolve ---
  const resolveError = useCallback(async (id: string) => {
    await delay(300);
    setErrors(prev =>
      prev.map(e => (e.id === id ? { ...e, resolved: true } : e))
    );
  }, []);

  return {
    // Общее
    loading,
    error,
    refresh: loadAll,

    // Система
    health,

    // Ошибки
    errors: visibleErrors,
    errorsTotal: filteredErrors.length,
    errorStats,
    errorFilters,
    setErrorFilters: handleSetErrorFilters,
    errorLoadMore,
    loadMoreErrors,
    setErrorPerPage,
    hasMoreErrors: errorLoadMore.visible < filteredErrors.length,
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
