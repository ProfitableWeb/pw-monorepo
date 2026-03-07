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
  TrendingUp,
  Users,
  Target,
  LayoutDashboard,
  Cog,
  Settings,
  BarChart3,
  LayoutPanelTop,
  SearchCheck,
} from 'lucide-react';

import { channels, campaigns } from './promotion.constants';
import { StatsGrid } from './StatsGrid';
import { ChannelCard } from './ChannelCard';
import { CampaignCard } from './CampaignCard';
import { QuickActions } from './QuickActions';

export function PromotionPage() {
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
      { label: 'Продвижение', icon: TrendingUp },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Заголовок */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold tracking-tight'>Продвижение</h1>
          <p className='text-muted-foreground'>
            Управление каналами распространения и маркетинговыми кампаниями
          </p>
        </div>
        <Button>
          <Target className='size-4 mr-2' />
          Новая кампания
        </Button>
      </div>

      {/* Общая статистика */}
      <StatsGrid />

      {/* Каналы */}
      <Card>
        <CardHeader>
          <CardTitle>Каналы распространения</CardTitle>
          <CardDescription>
            Социальные сети и площадки публикации
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {channels.map(channel => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Активные кампании */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Кампании</CardTitle>
              <CardDescription>
                Текущие и запланированные маркетинговые активности
              </CardDescription>
            </div>
            <Button variant='outline' size='sm'>
              Все кампании
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {campaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Быстрые действия */}
      <QuickActions />
    </div>
  );
}
