/**
 * PW-042-D2 | Подраздел «Мониторинг» в настройках.
 * Оркестратор: 3 таба — Система, Ошибки, Аудит.
 */

import { Skeleton } from '@/app/components/ui/skeleton';
import { Badge } from '@/app/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { useMonitoringData } from './useMonitoringData';
import { SystemTab } from './assets/SystemTab';
import { ErrorsTab } from './assets/ErrorsTab';
import { AuditTab } from './assets/AuditTab';

function LoadingSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-6 w-48' />
        <Skeleton className='h-4 w-80' />
      </div>
      <Skeleton className='h-10 w-80' />
      <Skeleton className='h-40 w-full' />
      <Skeleton className='h-32 w-full' />
    </div>
  );
}

export function MonitoringSettings() {
  const {
    health,
    loading,
    error,
    refresh,
    errors,
    errorsTotal,
    errorStats,
    errorFilters,
    setErrorFilters,
    errorLoadMore,
    loadMoreErrors,
    setErrorPerPage,
    hasMoreErrors,
    resolveError,
    audit,
    auditTotal,
    auditFilters,
    setAuditFilters,
    auditLoadMore,
    loadMoreAudit,
    setAuditPerPage,
    hasMoreAudit,
    uniqueAuditActions,
    uniqueAuditUsers,
  } = useMonitoringData();

  if (loading && !health) return <LoadingSkeleton />;

  if (error && !health) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight mb-2'>
            Мониторинг
          </h2>
        </div>
        <div className='text-center py-12'>
          <p className='text-sm text-red-500'>{error}</p>
        </div>
      </div>
    );
  }

  if (!health) return null;

  return (
    <div className='flex flex-col flex-1 min-h-0 gap-4'>
      <div className='flex-shrink-0'>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Мониторинг
        </h2>
        <p className='text-muted-foreground'>
          Состояние системы, ошибки API и аудит действий
        </p>
      </div>

      <Tabs
        defaultValue='system'
        variant='line'
        className='w-full flex-1 min-h-0 flex flex-col'
      >
        <TabsList>
          <TabsTrigger value='system'>Система</TabsTrigger>
          <TabsTrigger value='errors' className='flex items-center gap-2'>
            Ошибки
            {health.errors24h > 0 && (
              <Badge
                variant='destructive'
                className='h-5 min-w-[20px] px-1.5 text-xs'
              >
                {health.errors24h}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value='audit'>Аудит</TabsTrigger>
        </TabsList>

        <TabsContent
          value='system'
          className='mt-4 flex-1 min-h-0 flex flex-col'
        >
          <SystemTab health={health} loading={loading} onRefresh={refresh} />
        </TabsContent>

        <TabsContent
          value='errors'
          className='mt-4 flex-1 min-h-0 flex flex-col'
        >
          <ErrorsTab
            errors={errors}
            total={errorsTotal}
            stats={errorStats}
            filters={errorFilters}
            onFiltersChange={setErrorFilters}
            loadMore={errorLoadMore}
            hasMore={hasMoreErrors}
            onLoadMore={loadMoreErrors}
            onPerPageChange={setErrorPerPage}
            onResolve={resolveError}
          />
        </TabsContent>

        <TabsContent
          value='audit'
          className='mt-4 flex-1 min-h-0 flex flex-col'
        >
          <AuditTab
            entries={audit}
            total={auditTotal}
            filters={auditFilters}
            onFiltersChange={setAuditFilters}
            loadMore={auditLoadMore}
            hasMore={hasMoreAudit}
            onLoadMore={loadMoreAudit}
            onPerPageChange={setAuditPerPage}
            uniqueActions={uniqueAuditActions}
            uniqueUsers={uniqueAuditUsers}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
