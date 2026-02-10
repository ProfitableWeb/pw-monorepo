import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { useHeaderStore } from '@/app/store/header-store';
import { useNavigationStore } from '@/app/store/navigation-store';
import { FileHeart, Palette, Layout, Share2, Download, Copy, Upload, ChevronRight, Clock, Activity, BookOpen, LayoutDashboard } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { SectionCard } from '@/app/components/section-card';
import { SectionHeader } from '@/app/components/section-header';
import { ScrollArea } from '@/app/components/ui/scroll-area';

interface EditorialSection {
  id: 'manifest' | 'style' | 'formats' | 'socials';
  title: string;
  description: string;
  icon: typeof FileHeart;
  progress: number;
  itemsCount: number;
  itemsLabel: string;
  lastUpdate: string;
  color: string;
}

const editorialSections: EditorialSection[] = [
  {
    id: 'manifest',
    title: 'Манифест',
    description: 'Миссия, ценности и целевая аудитория издания',
    icon: FileHeart,
    progress: 87,
    itemsCount: 24,
    itemsLabel: 'параметра',
    lastUpdate: '5 минут назад',
    color: 'text-purple-500',
  },
  {
    id: 'style',
    title: 'Стиль',
    description: 'Голос бренда, правила написания и терминология',
    icon: Palette,
    progress: 72,
    itemsCount: 18,
    itemsLabel: 'правил',
    lastUpdate: '2 часа назад',
    color: 'text-blue-500',
  },
  {
    id: 'formats',
    title: 'Форматы',
    description: 'Шаблоны статей и структуры контента',
    icon: Layout,
    progress: 45,
    itemsCount: 8,
    itemsLabel: 'шаблонов',
    lastUpdate: '1 день назад',
    color: 'text-green-500',
  },
  {
    id: 'socials',
    title: 'Соцсети',
    description: 'Стратегия публикаций в социальных медиа',
    icon: Share2,
    progress: 90,
    itemsCount: 3,
    itemsLabel: 'платформы',
    lastUpdate: '10 минут назад',
    color: 'text-orange-500',
  },
];

export function EditorialHub() {
  const { setBreadcrumbs, reset } = useHeaderStore();
  const { navigateTo } = useNavigationStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Дашборд', href: 'dashboard', icon: LayoutDashboard },
      { label: 'Редакция', icon: BookOpen },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const overallProgress = Math.round(
    editorialSections.reduce((sum, section) => sum + section.progress, 0) / editorialSections.length
  );

  const aiReadiness = Math.round(
    editorialSections
      .filter(s => s.id === 'manifest' || s.id === 'style')
      .reduce((sum, section) => sum + section.progress, 0) / 2
  );

  const handleSectionClick = (sectionId: 'manifest' | 'style' | 'formats' | 'socials') => {
    navigateTo(sectionId);
  };

  const handleExport = () => {
    console.log('Экспорт настроек редакции');
  };

  const handleCopyForAI = () => {
    console.log('Копирование для AI');
  };

  const handleImport = () => {
    console.log('Импорт настроек');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Редакция</h1>
        <p className="text-muted-foreground">
          Определите identity вашего издания — от миссии до стиля написания
        </p>
      </div>

      {/* Editorial Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {editorialSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
              onClick={() => handleSectionClick(section.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg bg-muted/50 transition-colors group-hover:bg-muted",
                      section.color
                    )}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Заполненность</span>
                    <span className="font-medium">{section.progress}%</span>
                  </div>
                  <Progress value={section.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Activity className="size-4" />
                    <span>{section.itemsCount} {section.itemsLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5" />
                    <span className="text-xs">{section.lastUpdate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Overall Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Общая статистика</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Заполненность редакции</span>
                <span className="text-sm font-medium">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            {/* AI Readiness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Готовность к AI</span>
                <span className="text-sm font-medium">{aiReadiness}%</span>
              </div>
              <Progress value={aiReadiness} className="h-2" />
            </div>

            {/* Recent Activity */}
            <div className="flex items-start gap-2">
              <Activity className="size-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Последняя активность</p>
                <p className="text-sm font-medium truncate">
                  Обновлен манифест (5 минут назад)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Быстрые действия</CardTitle>
          <CardDescription>
            Управление настройками всего раздела редакции
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="size-4 mr-2" />
              Экспорт настроек
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyForAI}>
              <Copy className="size-4 mr-2" />
              Копировать для AI
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="size-4 mr-2" />
              Импорт настроек
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}