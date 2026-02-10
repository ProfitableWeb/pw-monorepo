import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { useHeaderStore } from '@/app/store/header-store';
import { 
  LayoutPanelTop,
  DollarSign,
  MousePointer,
  Eye,
  TrendingUp,
  Play,
  Pause,
  Plus,
  BarChart,
  Target,
  Calendar,
  Settings,
  LayoutDashboard,
  Cog,
  Users,
  BarChart3,
  SearchCheck,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface AdCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft' | 'completed';
  type: 'banner' | 'native' | 'video' | 'text';
  impressions: number;
  clicks: number;
  ctr: number;
  spent: number;
  budget: number;
  startDate: string;
  endDate: string;
}

interface AdPlacement {
  id: string;
  name: string;
  location: string;
  format: string;
  fillRate: number;
  revenue: number;
  impressions: number;
}

const campaigns: AdCampaign[] = [
  {
    id: '1',
    name: 'Промо премиум подписки',
    status: 'active',
    type: 'banner',
    impressions: 125000,
    clicks: 3200,
    ctr: 2.56,
    spent: 4500,
    budget: 10000,
    startDate: '1 фев 2026',
    endDate: '28 фев 2026',
  },
  {
    id: '2',
    name: 'Курс по веб-разработке',
    status: 'active',
    type: 'native',
    impressions: 89000,
    clicks: 2800,
    ctr: 3.15,
    spent: 3200,
    budget: 8000,
    startDate: '5 фев 2026',
    endDate: '5 мар 2026',
  },
  {
    id: '3',
    name: 'Партнерская программа',
    status: 'paused',
    type: 'text',
    impressions: 45000,
    clicks: 890,
    ctr: 1.98,
    spent: 1800,
    budget: 5000,
    startDate: '10 янв 2026',
    endDate: '10 фев 2026',
  },
  {
    id: '4',
    name: 'Видео-обзоры',
    status: 'draft',
    type: 'video',
    impressions: 0,
    clicks: 0,
    ctr: 0,
    spent: 0,
    budget: 15000,
    startDate: '15 фев 2026',
    endDate: '15 мар 2026',
  },
];

const placements: AdPlacement[] = [
  {
    id: '1',
    name: 'Сайдбар десктоп',
    location: 'Правая колонка',
    format: 'Banner 300x600',
    fillRate: 92,
    revenue: 2400,
    impressions: 89000,
  },
  {
    id: '2',
    name: 'Между статьями',
    location: 'Лента блога',
    format: 'Native',
    fillRate: 85,
    revenue: 3200,
    impressions: 125000,
  },
  {
    id: '3',
    name: 'Мобильный баннер',
    location: 'Низ экрана',
    format: 'Banner 320x100',
    fillRate: 78,
    revenue: 1800,
    impressions: 67000,
  },
  {
    id: '4',
    name: 'В статье',
    location: 'Середина контента',
    format: 'Banner 728x90',
    fillRate: 95,
    revenue: 4100,
    impressions: 156000,
  },
];

const statusLabels: Record<AdCampaign['status'], string> = {
  active: 'Активна',
  paused: 'Пауза',
  draft: 'Черновик',
  completed: 'Завершена',
};

const statusColors: Record<AdCampaign['status'], string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  paused: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const typeLabels: Record<AdCampaign['type'], string> = {
  banner: 'Баннер',
  native: 'Нативная',
  video: 'Видео',
  text: 'Текстовая',
};

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
        ]
      },
      { label: 'Реклама', icon: LayoutPanelTop },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const totalRevenue = placements.reduce((sum, p) => sum + p.revenue, 0);
  const totalImpressions = placements.reduce((sum, p) => sum + p.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const averageCtr = (campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.filter(c => c.status !== 'draft').length).toFixed(2);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Реклама</h1>
          <p className="text-muted-foreground">
            Управление рекламными кампаниями и монетизацией
          </p>
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          Новая кампания
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="size-4" />
              Доход
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              За текущий месяц
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Eye className="size-4" />
              Показы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalImpressions / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground mt-1">
              Всего показов
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MousePointer className="size-4" />
              Клики
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Переходов по рекламе
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="size-4" />
              CTR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCtr}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Средний показатель
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Рекламные кампании</CardTitle>
          <CardDescription>Активные и запланированные кампании</CardDescription>
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
                      <p className="font-medium">{campaign.name}</p>
                      <Badge variant="outline" className={cn("text-xs", statusColors[campaign.status])}>
                        {statusLabels[campaign.status]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {typeLabels[campaign.type]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>{campaign.startDate} - {campaign.endDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      {campaign.status === 'active' ? (
                        <Pause className="size-4" />
                      ) : (
                        <Play className="size-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="size-4" />
                    </Button>
                  </div>
                </div>

                {campaign.status !== 'draft' && (
                  <>
                    <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Показы</p>
                        <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Клики</p>
                        <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">CTR</p>
                        <p className="font-medium">{campaign.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Потрачено</p>
                        <p className="font-medium">${campaign.spent.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Бюджет</span>
                        <span className="font-medium">
                          ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ad Placements */}
      <Card>
        <CardHeader>
          <CardTitle>Рекламные места</CardTitle>
          <CardDescription>Площадки для показа рекламы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {placements.map((placement) => (
              <div
                key={placement.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium mb-1">{placement.name}</p>
                    <p className="text-sm text-muted-foreground">{placement.location}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {placement.format}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground mb-1">Показы</p>
                    <p className="font-medium">{(placement.impressions / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Доход</p>
                    <p className="font-medium">${placement.revenue}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Fill Rate</p>
                    <p className="font-medium">{placement.fillRate}%</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Заполненность</span>
                    <span className="font-medium">{placement.fillRate}%</span>
                  </div>
                  <Progress value={placement.fillRate} className="h-1.5" />
                </div>
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
            Инструменты для управления рекламой
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <BarChart className="size-4 mr-2" />
              Отчет по доходам
            </Button>
            <Button variant="outline" size="sm">
              <Target className="size-4 mr-2" />
              Настройки таргетинга
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="size-4 mr-2" />
              Управление площадками
            </Button>
            <Button variant="outline" size="sm">
              <DollarSign className="size-4 mr-2" />
              История выплат
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}