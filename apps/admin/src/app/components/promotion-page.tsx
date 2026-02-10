import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { useHeaderStore } from '@/app/store/header-store';
import { 
  TrendingUp, 
  Share2,
  MessageCircle,
  Eye,
  Heart,
  ExternalLink,
  ArrowUpRight,
  Users,
  Target,
  Zap,
  LayoutDashboard,
  Cog,
  Settings,
  BarChart3,
  LayoutPanelTop,
  SearchCheck,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface Channel {
  id: string;
  name: string;
  icon: typeof Share2;
  color: string;
  subscribers: number;
  engagement: number;
  posts: number;
  reach: number;
  status: 'active' | 'paused' | 'scheduled';
}

interface Campaign {
  id: string;
  title: string;
  channel: string;
  status: 'active' | 'scheduled' | 'completed';
  progress: number;
  reach: number;
  engagement: number;
  startDate: string;
}

const channels: Channel[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    icon: MessageCircle,
    color: 'text-blue-500',
    subscribers: 12500,
    engagement: 8.5,
    posts: 142,
    reach: 98000,
    status: 'active',
  },
  {
    id: 'vk',
    name: 'ВКонтакте',
    icon: Share2,
    color: 'text-blue-600',
    subscribers: 8200,
    engagement: 5.2,
    posts: 98,
    reach: 45000,
    status: 'active',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: Share2,
    color: 'text-gray-900',
    subscribers: 3400,
    engagement: 6.8,
    posts: 234,
    reach: 28000,
    status: 'active',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Share2,
    color: 'text-red-500',
    subscribers: 5600,
    engagement: 12.3,
    posts: 24,
    reach: 156000,
    status: 'paused',
  },
];

const campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Запуск нового формата статей',
    channel: 'Telegram',
    status: 'active',
    progress: 65,
    reach: 8500,
    engagement: 7.2,
    startDate: '15 янв 2026',
  },
  {
    id: '2',
    title: 'Промо серии гайдов по React',
    channel: 'ВКонтакте',
    status: 'active',
    progress: 42,
    reach: 3200,
    engagement: 5.8,
    startDate: '18 янв 2026',
  },
  {
    id: '3',
    title: 'Конкурс для читателей',
    channel: 'Twitter / X',
    status: 'scheduled',
    progress: 0,
    reach: 0,
    engagement: 0,
    startDate: '1 ��ев 2026',
  },
];

const statusLabels: Record<Campaign['status'], string> = {
  active: 'Активна',
  scheduled: 'Запланирована',
  completed: 'Завершена',
};

const statusColors: Record<Campaign['status'], string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  scheduled: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  completed: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

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
        ]
      },
      { label: 'Продвижение', icon: TrendingUp },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const totalSubscribers = channels.reduce((sum, ch) => sum + ch.subscribers, 0);
  const averageEngagement = (channels.reduce((sum, ch) => sum + ch.engagement, 0) / channels.length).toFixed(1);
  const totalReach = channels.reduce((sum, ch) => sum + ch.reach, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Продвижение</h1>
          <p className="text-muted-foreground">
            Управление каналами распространения и маркетинговыми кампаниями
          </p>
        </div>
        <Button>
          <Target className="size-4 mr-2" />
          Новая кампания
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Подписчики</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="size-3 text-green-500" />
              +12% за месяц
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Вовлеченность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageEngagement}%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="size-3 text-green-500" />
              +0.8% за месяц
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Охват</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalReach / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground mt-1">
              За последние 30 дней
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Активные кампании</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {campaigns.filter(c => c.status === 'scheduled').length} запланировано
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Каналы распространения</CardTitle>
          <CardDescription>Социальные сети и площадки публикации</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div
                  key={channel.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg bg-muted/50", channel.color)}>
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium">{channel.name}</p>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs mt-1",
                            channel.status === 'active' 
                              ? 'bg-green-500/10 text-green-500 border-green-500/20'
                              : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          )}
                        >
                          {channel.status === 'active' ? 'Активен' : 'Пауза'}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="size-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Подписчики</p>
                      <p className="font-medium">{channel.subscribers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Вовлеченность</p>
                      <p className="font-medium">{channel.engagement}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Публикаций</p>
                      <p className="font-medium">{channel.posts}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Охват</p>
                      <p className="font-medium">{(channel.reach / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Кампании</CardTitle>
              <CardDescription>Текущие и запланированные маркетинговые активности</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Все кампании
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{campaign.title}</p>
                      <Badge variant="outline" className={cn("text-xs", statusColors[campaign.status])}>
                        {statusLabels[campaign.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaign.channel} • {campaign.startDate}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Подробнее
                  </Button>
                </div>
                {campaign.status !== 'scheduled' && (
                  <>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="font-medium">{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="size-4 text-muted-foreground" />
                        <span>{campaign.reach.toLocaleString()} охват</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="size-4 text-muted-foreground" />
                        <span>{campaign.engagement}% вовлеченность</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Быстрые действия</CardTitle>
          <CardDescription>
            Инструменты для управления продвижением
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Zap className="size-4 mr-2" />
              Автопостинг
            </Button>
            <Button variant="outline" size="sm">
              <Target className="size-4 mr-2" />
              Таргетированная реклама
            </Button>
            <Button variant="outline" size="sm">
              <Users className="size-4 mr-2" />
              Анализ аудитории
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="size-4 mr-2" />
              Отчет по продвижению
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}