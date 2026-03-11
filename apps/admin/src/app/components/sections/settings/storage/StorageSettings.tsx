/**
 * PW-041-D1 | Подраздел «Хранилище» в настройках.
 * Оркестратор: 3 таба — Обзор, Статистика, Диагностика.
 */

import { Skeleton } from '@/app/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { useStorageInfo } from './useStorageInfo';
import { OverviewTab } from './assets/OverviewTab';
import { StatsTab } from './assets/StatsTab';
import { DiagnosticsTab } from './assets/DiagnosticsTab';

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

export function StorageSettings() {
  const {
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
    refresh,
  } = useStorageInfo();

  if (loading && !info) return <LoadingSkeleton />;

  if (error && !info) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight mb-2'>
            Файловое хранилище
          </h2>
        </div>
        <div className='text-center py-12'>
          <p className='text-sm text-red-500'>{error}</p>
        </div>
      </div>
    );
  }

  if (!info) return null;

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Файловое хранилище
        </h2>
        <p className='text-muted-foreground'>
          Состояние системы хранения, статистика и диагностика
        </p>
      </div>

      <Tabs defaultValue='overview' variant='line' className='w-full'>
        <TabsList>
          <TabsTrigger value='overview'>Обзор</TabsTrigger>
          <TabsTrigger value='stats'>Статистика</TabsTrigger>
          <TabsTrigger value='diagnostics'>Диагностика</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='mt-6'>
          <OverviewTab
            info={info}
            onRefresh={refresh}
            loading={loading}
            syncing={syncing}
            onSync={runSync}
            savingLimits={savingLimits}
            onSaveLimits={saveLimits}
          />
        </TabsContent>

        <TabsContent value='stats' className='mt-6'>
          <StatsTab stats={info.stats} />
        </TabsContent>

        <TabsContent value='diagnostics' className='mt-6'>
          <DiagnosticsTab
            testResult={testResult}
            testing={testing}
            onRunTest={runTest}
            backend={info.backend}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
