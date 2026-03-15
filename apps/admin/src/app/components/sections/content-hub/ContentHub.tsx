import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { useHeaderStore } from '@/app/store/header-store';
import { useNavigationStore } from '@/app/store/navigation-store';
import {
  FileText,
  Calendar,
  FolderOpen,
  Tag,
  Image,
  FolderKanban,
  ChevronRight,
  Clock,
  Activity,
  Layers,
  LayoutDashboard,
  Circle,
} from 'lucide-react';

interface ContentSection {
  id: 'articles' | 'calendar' | 'categories' | 'tags' | 'media' | 'research';
  title: string;
  description: string;
  icon: typeof FileText;
  progress: number;
  itemsCount: number;
  itemsLabel: string;
  lastUpdate: string;
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
  },
  {
    id: 'research',
    title: 'Проекты',
    description: 'Исследования и рабочие проекты',
    icon: FolderKanban,
    progress: 45,
    itemsCount: 8,
    itemsLabel: 'проектов',
    lastUpdate: '2 часа назад',
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

  const handleSectionClick = (sectionId: ContentSection['id']) => {
    navigateTo(sectionId);
  };

  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Заголовок */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-semibold tracking-tight'>Контент</h1>
        <p className='text-muted-foreground'>
          Управление материалами блога — от статей до медиафайлов
        </p>
      </div>

      {/* Сетка разделов контента */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {contentSections.map(section => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              className='group cursor-pointer transition-all hover:shadow-md hover:border-primary/50'
              onClick={() => handleSectionClick(section.id)}
            >
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-muted/50 transition-colors group-hover:bg-muted text-muted-foreground'>
                      <Icon className='size-5' />
                    </div>
                    <div>
                      <CardTitle className='text-lg'>{section.title}</CardTitle>
                      <CardDescription className='text-sm mt-1'>
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronRight className='size-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
                </div>
              </CardHeader>
              <CardContent className='space-y-3'>
                {/* Прогресс */}
                <div className='space-y-1.5'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Заполненность</span>
                    <span className='font-medium'>{section.progress}%</span>
                  </div>
                  <Progress value={section.progress} className='h-2' />
                </div>

                {/* Статистика */}
                <div className='flex items-center justify-between text-sm'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Activity className='size-4' />
                    <span>
                      {section.itemsCount} {section.itemsLabel}
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5 text-muted-foreground'>
                    <Clock className='size-3.5' />
                    <span className='text-xs'>{section.lastUpdate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Последняя активность */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Последняя активность</CardTitle>
          <CardDescription>Недавние изменения в контенте</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {[
              {
                text: 'Добавлены 3 новых изображения',
                time: '5 минут назад',
                section: 'Медиа',
              },
              {
                text: 'Опубликована статья «Автоматизация рутины»',
                time: '10 минут назад',
                section: 'Статьи',
              },
              {
                text: 'Обновлён календарь на следующую неделю',
                time: '15 минут назад',
                section: 'Календарь',
              },
              {
                text: 'Создана новая категория «Инструменты»',
                time: '1 час назад',
                section: 'Категории',
              },
              {
                text: 'Добавлено 5 новых меток',
                time: '2 часа назад',
                section: 'Метки',
              },
            ].map((item, i) => (
              <div key={i} className='flex items-start gap-3'>
                <Circle className='size-2 mt-2 fill-muted-foreground text-muted-foreground flex-shrink-0' />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm'>{item.text}</p>
                  <div className='flex items-center gap-2 mt-0.5'>
                    <span className='text-xs text-muted-foreground'>
                      {item.section}
                    </span>
                    <span className='text-xs text-muted-foreground'>·</span>
                    <span className='text-xs text-muted-foreground'>
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
