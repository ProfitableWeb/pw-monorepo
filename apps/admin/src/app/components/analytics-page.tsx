import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useHeaderStore } from '@/app/store/header-store';
import { 
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download,
  Filter,
  Settings,
  LayoutDashboard,
  Cog,
  LayoutPanelTop,
  SearchCheck,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const viewsData = [
  { date: '1 фев', views: 2400, visitors: 1800 },
  { date: '3 фев', views: 1398, visitors: 1200 },
  { date: '5 фев', views: 9800, visitors: 7200 },
  { date: '7 фев', views: 3908, visitors: 2800 },
  { date: '9 фев', views: 4800, visitors: 3600 },
  { date: '11 фев', views: 3800, visitors: 2900 },
  { date: '13 фев', views: 4300, visitors: 3200 },
];

const topArticles = [
  { title: 'Гайд по React Server Components', views: 12500, engagement: 8.2 },
  { title: '10 трендов веб-дизайна 2026', views: 9800, engagement: 6.5 },
  { title: 'Лучшие практики TypeScript', views: 8200, engagement: 7.8 },
  { title: 'Обзор новых возможностей Next.js 15', views: 7600, engagement: 5.9 },
  { title: 'Оптимизация производительности React', views: 6800, engagement: 7.2 },
];

const deviceData = [
  { name: 'Desktop', value: 58, color: '#3b82f6' },
  { name: 'Mobile', value: 35, color: '#10b981' },
  { name: 'Tablet', value: 7, color: '#f59e0b' },
];

const sourceData = [
  { source: 'Прямые заходы', visits: 4200, percentage: 35 },
  { source: 'Поисковики', visits: 3800, percentage: 32 },
  { source: 'Социальные сети', visits: 2400, percentage: 20 },
  { source: 'Рефералы', visits: 1200, percentage: 10 },
  { source: 'Email', visits: 360, percentage: 3 },
];

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
        ]
      },
      { label: 'Аналитика', icon: BarChart3 },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Аналитика</h1>
          <p className="text-muted-foreground">
            Детальная статистика посещаемости и поведения пользователей
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="size-4 mr-2" />
            Последние 30 дней
          </Button>
          <Button variant="outline" size="sm">
            <Download className="size-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Eye className="size-4" />
              Просмотры
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUp className="size-3 text-green-500" />
              <span className="text-green-500">+12.5%</span> за месяц
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="size-4" />
              Посетители
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32,450</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUp className="size-3 text-green-500" />
              <span className="text-green-500">+8.2%</span> за месяц
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="size-4" />
              ремя на сайте
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4:32</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUp className="size-3 text-green-500" />
              <span className="text-green-500">+15s</span> за месяц
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowDown className="size-4" />
              Отказы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowDown className="size-3 text-green-500" />
              <span className="text-green-500">-2.1%</span> за месяц
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Просмотры и посетители</CardTitle>
          <CardDescription>Динамика за последние 2 недели</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewsData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" name="Просмотры" />
              <Area type="monotone" dataKey="visitors" stroke="#10b981" fillOpacity={1} fill="url(#colorVisitors)" name="Посетители" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Топ статей</CardTitle>
            <CardDescription>Самые популярные публикации</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topArticles.map((article, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted flex-shrink-0">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{article.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="size-3" />
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="size-3" />
                        <span>{article.engagement}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Устройства</CardTitle>
            <CardDescription>Распределение по типам устройств</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="40%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Monitor className="size-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Desktop</p>
                    <p className="text-xs text-muted-foreground">58% посетителей</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Smartphone className="size-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Mobile</p>
                    <p className="text-xs text-muted-foreground">35% посетителей</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Smartphone className="size-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tablet</p>
                    <p className="text-xs text-muted-foreground">7% посетителей</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Источники трафика</CardTitle>
          <CardDescription>Откуда приходят посетители</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sourceData.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="size-4 text-muted-foreground" />
                    <span className="font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{source.visits.toLocaleString()} визитов</span>
                    <span className="font-medium min-w-[3rem] text-right">{source.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}