import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { useHeaderStore } from '@/app/store/header-store';
import { useNavigationStore } from '@/app/store/navigation-store';
import { FileText, Calendar, FolderOpen, Tag, Image, Download, Upload, Filter, ChevronRight, Clock, Activity, Layers, LayoutDashboard } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { SectionCard } from '@/app/components/section-card';
import { SectionHeader } from '@/app/components/section-header';
import { ScrollArea } from '@/app/components/ui/scroll-area';

interface ContentSection {
  id: 'articles' | 'calendar' | 'categories' | 'tags' | 'media';
  title: string;
  description: string;
  icon: typeof FileText;
  progress: number;
  itemsCount: number;
  itemsLabel: string;
  lastUpdate: string;
  color: string;
}

const contentSections: ContentSection[] = [
  {
    id: 'articles',
    title: 'Статьи',
    description: 'Управление публикациями и черновиками',
    icon: FileText,
    progress: 65,
    itemsCount: 142,
    itemsLabel: 'статьи',
    lastUpdate: '10 минут назад',
    color: 'text-blue-500',
  },
  {
    id: 'calendar',
    title: 'Календарь',
    description: 'График и планирование публикаций',
    icon: Calendar,
    progress: 80,
    itemsCount: 28,
    itemsLabel: 'запланировано',
    lastUpdate: '15 минут назад',
    color: 'text-green-500',
  },
  {
    id: 'categories',
    title: 'Категории',
    description: 'Организация контента по рубрикам',
    icon: FolderOpen,
    progress: 92,
    itemsCount: 12,
    itemsLabel: 'категорий',
    lastUpdate: '1 час назад',
    color: 'text-purple-500',
  },
  {
    id: 'tags',
    title: 'Метки',
    description: 'Теги и ключевые слова для навигации',
    icon: Tag,
    progress: 88,
    itemsCount: 45,
    itemsLabel: 'меток',
    lastUpdate: '30 минут назад',
    color: 'text-orange-500',
  },
  {
    id: 'media',
    title: 'Медиа',
    description: 'Изображения и медиафайлы',
    icon: Image,
    progress: 74,
    itemsCount: 357,
    itemsLabel: 'файлов',
    lastUpdate: '5 минут назад',
    color: 'text-pink-500',
  },
];

export function ContentHub() {
  const { setBreadcrumbs, reset } = useHeaderStore();
  const { navigateTo } = useNavigationStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Дашборд', href: 'dashboard', icon: LayoutDashboard },
      { label: 'Контент', icon: Layers },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const overallProgress = Math.round(
    contentSections.reduce((sum, section) => sum + section.progress, 0) / contentSections.length
  );

  const totalItems = contentSections.reduce((sum, section) => sum + section.itemsCount, 0);

  const handleSectionClick = (sectionId: 'articles' | 'calendar' | 'categories' | 'tags' | 'media') => {
    navigateTo(sectionId);
  };

  const handleExport = () => {
    console.log('Экспорт контента');
  };

  const handleBulkEdit = () => {
    console.log('Массовое редактирование');
  };

  const handleImport = () => {
    console.log('Импорт контента');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Контент</h1>
        <p className="text-muted-foreground">
          Управление материалами блога — от статей до медиафайлов
        </p>
      </div>

      {/* Content Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contentSections.map((section) => {
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
                <span className="text-sm text-muted-foreground">Заполненность контента</span>
                <span className="text-sm font-medium">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            {/* Total Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Всего элементов</span>
                <span className="text-sm font-medium">{totalItems}</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            {/* Recent Activity */}
            <div className="flex items-start gap-2">
              <Activity className="size-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Последняя активность</p>
                <p className="text-sm font-medium truncate">
                  Добавлена новая медиа (5 минут назад)
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
            Управление контентом всего раздела
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="size-4 mr-2" />
              Экспорт контента
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkEdit}>
              <Filter className="size-4 mr-2" />
              Массовое редактирование
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="size-4 mr-2" />
              Импорт контента
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}