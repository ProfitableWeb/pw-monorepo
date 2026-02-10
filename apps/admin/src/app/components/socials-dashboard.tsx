import { useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { useHeaderStore } from '@/app/store/header-store';
import { Share2, Twitter, Facebook, Linkedin, Instagram, Youtube, TrendingUp, Calendar, LayoutDashboard, Pencil, Plus, BarChart3 } from 'lucide-react';
import { SectionCard } from '@/app/components/section-card';
import { SectionHeader } from '@/app/components/section-header';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Progress } from '@/app/components/ui/progress';

export function SocialsDashboard() {
  const { setBreadcrumbs, reset } = useHeaderStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Дашборд', href: 'dashboard', icon: LayoutDashboard },
      { label: 'Редакция', href: 'editorial-hub', icon: Pencil },
      { label: 'Соцсети', icon: Share2 },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const activePlatforms = [
    {
      icon: Twitter,
      name: 'Twitter / X',
      status: 'active',
      followers: '12.5K',
      description: 'Короткие новости и анонсы статей',
      postsPerWeek: 5,
      engagement: 3.2,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      icon: Facebook,
      name: 'Facebook',
      status: 'active',
      followers: '8.2K',
      description: 'Длинные посты и дискуссии с читателями',
      postsPerWeek: 3,
      engagement: 2.8,
      color: 'bg-blue-600/10 text-blue-600',
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      status: 'active',
      followers: '5.1K',
      description: 'Профессиональный контент и аналитика',
      postsPerWeek: 2,
      engagement: 4.1,
      color: 'bg-blue-700/10 text-blue-700',
    },
  ];

  const plannedPlatforms = [
    {
      icon: Instagram,
      name: 'Instagram',
      description: 'Визуальный контент и сторис',
      color: 'bg-pink-500/10 text-pink-500',
    },
    {
      icon: Youtube,
      name: 'YouTube',
      description: 'Видеоконтент и туториалы',
      color: 'bg-red-500/10 text-red-500',
    },
  ];

  const overallEngagement = (
    activePlatforms.reduce((sum, p) => sum + p.engagement, 0) / activePlatforms.length
  ).toFixed(1);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="max-w-5xl mx-auto p-6 space-y-8 pb-12">
          {/* Header */}
          <SectionHeader
            icon={Share2}
            title="Социальные сети"
            description="Стратегия и управление присутствием в социальных медиа"
          />

          {/* Status Overview Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Активные платформы</div>
                  <div className="text-3xl font-bold">{activePlatforms.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {plannedPlatforms.length} в планах
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Общий охват</div>
                  <div className="text-3xl font-bold">
                    {(activePlatforms.reduce((sum, p) => sum + parseFloat(p.followers.replace('K', '')), 0)).toFixed(1)}K
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% за месяц
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Средний engagement</div>
                  <div className="text-3xl font-bold">{overallEngagement}%</div>
                  <Progress value={parseFloat(overallEngagement) * 20} className="mt-2 h-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Platforms */}
          <div>
            <SectionHeader
              variant="small"
              icon={Share2}
              title="Активные платформы"
              className="mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePlatforms.map((platform) => (
                <Card
                  key={platform.name}
                  className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                  onClick={() => console.log(`Открыть ${platform.name}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platform.color}`}>
                        <platform.icon className="h-5 w-5" />
                      </div>
                      <Badge variant="default" className="text-xs">
                        Активна
                      </Badge>
                    </div>
                    <h4 className="font-semibold mb-1">{platform.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {platform.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Подписчики</span>
                        <span className="font-medium">{platform.followers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Постов/неделю</span>
                        <span className="font-medium">{platform.postsPerWeek}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Engagement</span>
                        <span className="font-medium text-green-500">{platform.engagement}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Planned Platforms */}
          <div>
            <SectionHeader
              variant="small"
              icon={Calendar}
              title="Планируемые платформы"
              className="mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plannedPlatforms.map((platform) => (
                <Card
                  key={platform.name}
                  className="border-dashed cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                  onClick={() => console.log(`Настроить ${platform.name}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platform.color}`}>
                        <platform.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{platform.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            Планируется
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {platform.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Analytics Section */}
          <div>
            <SectionHeader
              variant="small"
              icon={BarChart3}
              title="Аналитика и инструменты"
              className="mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SectionCard
                icon={BarChart3}
                title="Аналитика"
                description="Детальная статистика по всем платформам"
                variant="tool"
                onClick={() => console.log('Открыть аналитику')}
              />
              <SectionCard
                icon={Calendar}
                title="Контент-план"
                description="График публикаций в соцсетях"
                variant="tool"
                onClick={() => console.log('Открыть контент-план')}
              />
              <SectionCard
                icon={TrendingUp}
                title="Стратегия"
                description="Цели и KPI по каждой платформе"
                variant="tool"
                onClick={() => console.log('Открыть стратегию')}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold mb-2">Добавить платформу</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Расширьте присутствие вашего блога в социальных сетях
                  </p>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Подключить соцсеть
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
