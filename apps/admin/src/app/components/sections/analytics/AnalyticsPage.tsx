import { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { useHeaderStore } from '@/app/store/header-store';
import { BarChart3, Calendar, Download, LayoutDashboard } from 'lucide-react';
import { SYSTEM_BREADCRUMB } from '@/app/store/breadcrumb.constants';
import { StatsCards } from './assets/StatsCards';
import { ViewsChart } from './assets/ViewsChart';
import { TopArticles } from './assets/TopArticles';
import { DevicesChart } from './assets/DevicesChart';
import { TrafficSources } from './assets/TrafficSources';

export function AnalyticsPage() {
  const { setBreadcrumbs, reset } = useHeaderStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Дашборд', href: 'dashboard', icon: LayoutDashboard },
      SYSTEM_BREADCRUMB,
      { label: 'Аналитика', icon: BarChart3 },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Заголовок */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold tracking-tight'>Аналитика</h1>
          <p className='text-muted-foreground'>
            Детальная статистика посещаемости и поведения пользователей
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm'>
            <Calendar className='size-4 mr-2' />
            Последние 30 дней
          </Button>
          <Button variant='outline' size='sm'>
            <Download className='size-4 mr-2' />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Ключевые метрики */}
      <StatsCards />

      {/* График просмотров */}
      <ViewsChart />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Топ статей */}
        <TopArticles />

        {/* Распределение по устройствам */}
        <DevicesChart />
      </div>

      {/* Источники трафика */}
      <TrafficSources />
    </div>
  );
}
