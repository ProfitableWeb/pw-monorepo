import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useHeaderStore } from '@/app/store/header-store';
import {
  LayoutPanelTop,
  DollarSign,
  TrendingUp,
  Plus,
  BarChart,
  Target,
  Settings,
  LayoutDashboard,
  Cog,
  Users,
  BarChart3,
  SearchCheck,
} from 'lucide-react';
import { campaigns, placements } from './ads.constants';
import { AdsStatsGrid } from './AdsStatsGrid';
import { CampaignCard } from './CampaignCard';
import { PlacementCard } from './PlacementCard';

export function AdsPage() {
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
      { label: 'Реклама', icon: LayoutPanelTop },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const totalRevenue = placements.reduce((sum, p) => sum + p.revenue, 0);
  const totalImpressions = placements.reduce(
    (sum, p) => sum + p.impressions,
    0
  );
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const averageCtr = (
    campaigns.reduce((sum, c) => sum + c.ctr, 0) /
    campaigns.filter(c => c.status !== 'draft').length
  ).toFixed(2);

  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Заголовок */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold tracking-tight'>Реклама</h1>
          <p className='text-muted-foreground'>
            Управление рекламными кампаниями и монетизацией
          </p>
        </div>
        <Button>
          <Plus className='size-4 mr-2' />
          Новая кампания
        </Button>
      </div>

      {/* Статистика */}
      <AdsStatsGrid
        totalRevenue={totalRevenue}
        totalImpressions={totalImpressions}
        totalClicks={totalClicks}
        averageCtr={averageCtr}
      />

      {/* Кампании */}
      <Card>
        <CardHeader>
          <CardTitle>Рекламные кампании</CardTitle>
          <CardDescription>Активные и запланированные кампании</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {campaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Рекламные размещения */}
      <Card>
        <CardHeader>
          <CardTitle>Рекламные места</CardTitle>
          <CardDescription>Площадки для показа рекламы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {placements.map(placement => (
              <PlacementCard key={placement.id} placement={placement} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Быстрые действия */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Быстрые действия</CardTitle>
          <CardDescription>Инструменты для управления рекламой</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            <Button variant='outline' size='sm'>
              <BarChart className='size-4 mr-2' />
              Отчет по доходам
            </Button>
            <Button variant='outline' size='sm'>
              <Target className='size-4 mr-2' />
              Настройки таргетинга
            </Button>
            <Button variant='outline' size='sm'>
              <Settings className='size-4 mr-2' />
              Управление площадками
            </Button>
            <Button variant='outline' size='sm'>
              <DollarSign className='size-4 mr-2' />
              История выплат
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
