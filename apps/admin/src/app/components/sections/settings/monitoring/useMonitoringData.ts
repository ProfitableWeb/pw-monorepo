/**
 * PW-042-D | Хук для раздела «Мониторинг».
 * Health — реальный API (PW-042-C). Ошибки — реальный API (PW-042-B). Аудит — реальный API (PW-042-D).
 */

import { useCallback, useEffect, useState } from 'react';
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
  adminGetSystemHealth,
  adminGetErrors,
  adminGetErrorStats,
  adminResolveError,
  adminGetAudit,
  adminGetAuditActions,
  adminGetAuditUsers,
} from '@/lib/api-client';
import { DEFAULT_PER_PAGE } from './monitoring.utils';

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

  // --- Аудит (реальный API — PW-042-D) ---
  const [audit, setAudit] = useState<AuditLogEntry[]>([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditFilters, setAuditFilters] = useState<AuditFilters>({
    action: null,
    userId: null,
    dateRange: 'all',
  });
  const [auditLoadMore, setAuditLoadMore] = useState<LoadMoreState>({
    visible: DEFAULT_PER_PAGE,
    perPage: DEFAULT_PER_PAGE,
  });
  const [auditLoading, setAuditLoading] = useState(false);
  const [uniqueAuditActions, setUniqueAuditActions] = useState<string[]>([]);
  const [uniqueAuditUsers, setUniqueAuditUsers] = useState<[string, string][]>(
    []
  );

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

  // --- Загрузка аудита (серверная фильтрация + пагинация) ---
  const fetchAudit = useCallback(
    async (
      filters: AuditFilters,
      limit: number,
      offset: number,
      append: boolean
    ) => {
      setAuditLoading(true);
      try {
        const result = await adminGetAudit({
          limit,
          offset,
          action: filters.action ?? undefined,
          userId: filters.userId ?? undefined,
          dateRange:
            filters.dateRange !== 'all' ? filters.dateRange : undefined,
        });
        if (append) {
          setAudit(prev => [...prev, ...result.data]);
        } else {
          setAudit(result.data);
        }
        setAuditTotal(result.meta.total ?? 0);
      } catch {
        setError('Не удалось загрузить аудит');
      } finally {
        setAuditLoading(false);
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

      // Аудит — реальный API (PW-042-D)
      const [auditResult, actions, users] = await Promise.all([
        adminGetAudit({ limit: DEFAULT_PER_PAGE, offset: 0 }),
        adminGetAuditActions(),
        adminGetAuditUsers(),
      ]);
      setAudit(auditResult.data);
      setAuditTotal(auditResult.meta.total ?? 0);
      setUniqueAuditActions(actions);
      setUniqueAuditUsers(users);
      setAuditLoadMore({
        visible: DEFAULT_PER_PAGE,
        perPage: DEFAULT_PER_PAGE,
      });
      setAuditFilters({ action: null, userId: null, dateRange: 'all' });
    } catch {
      setError('Не удалось загрузить данные мониторинга');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // --- Действия: фильтры ошибок (серверная фильтрация) ---
  const handleSetErrorFilters = useCallback(
    (f: ErrorFilters) => {
      setErrorFilters(f);
      setErrorLoadMore(prev => ({ ...prev, visible: prev.perPage }));
      fetchErrors(f, errorLoadMore.perPage, 0, false);
    },
    [fetchErrors, errorLoadMore.perPage]
  );

  // --- Действия: фильтры аудита (серверная фильтрация) ---
  const handleSetAuditFilters = useCallback(
    (f: AuditFilters) => {
      setAuditFilters(f);
      setAuditLoadMore(prev => ({ ...prev, visible: prev.perPage }));
      fetchAudit(f, auditLoadMore.perPage, 0, false);
    },
    [fetchAudit, auditLoadMore.perPage]
  );

  // --- Действия: load more ---
  const loadMoreErrors = useCallback(() => {
    fetchErrors(errorFilters, errorLoadMore.perPage, errors.length, true);
  }, [errorLoadMore.perPage, errorFilters, errors.length, fetchErrors]);

  const loadMoreAudit = useCallback(() => {
    fetchAudit(auditFilters, auditLoadMore.perPage, audit.length, true);
  }, [auditLoadMore.perPage, auditFilters, audit.length, fetchAudit]);

  // --- Действия: изменение perPage ---
  const setErrorPerPage = useCallback(
    (perPage: number) => {
      setErrorLoadMore({ visible: perPage, perPage });
      fetchErrors(errorFilters, perPage, 0, false);
    },
    [errorFilters, fetchErrors]
  );

  const setAuditPerPage = useCallback(
    (perPage: number) => {
      setAuditLoadMore({ visible: perPage, perPage });
      fetchAudit(auditFilters, perPage, 0, false);
    },
    [auditFilters, fetchAudit]
  );

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
    loading: loading || errorsLoading || auditLoading,
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
    audit,
    auditTotal,
    auditFilters,
    setAuditFilters: handleSetAuditFilters,
    auditLoadMore,
    loadMoreAudit,
    setAuditPerPage,
    hasMoreAudit: audit.length < auditTotal,
    uniqueAuditActions,
    uniqueAuditUsers,
  };
}
