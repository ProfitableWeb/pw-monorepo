import { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { useHeaderStore } from '@/app/store/header-store';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Settings,
  LayoutDashboard,
  Cog,
  LayoutPanelTop,
  SearchCheck,
} from 'lucide-react';
import { StatsCards } from './StatsCards';
import { ViewsChart } from './ViewsChart';
import { TopArticles } from './TopArticles';
import { DevicesChart } from './DevicesChart';
import { TrafficSources } from './TrafficSources';

export function AnalyticsPage() {
  const { setBreadcrumbs, reset } = useHeaderStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Дашборд', href: 'dashboard', icon: LayoutDashboard },
      {
        label: 'Система',
        icon: Cog,
        dropdown: [
          { label: 'Настройки', icon: Settings, href: 'settings' },
          { label: 'Пользователи', icon: Users, href: 'users' },
          { label: 'Продвижение', icon: TrendingUp, href: 'promotion' },
          { label: 'Аналитика', icon: BarChart3, href: 'analytics' },
          { label: 'Реклама', icon: LayoutPanelTop, href: 'ads' },
          { label: 'SEO', icon: SearchCheck, href: 'seo' },
        ],
      },
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
