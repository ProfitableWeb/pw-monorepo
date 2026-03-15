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
  Settings,
  Users,
  TrendingUp,
  BarChart,
  LayoutPanelTop,
  SearchCheck,
  ChevronRight,
  Clock,
  Activity,
  LayoutDashboard,
  Wrench,
  Circle,
} from 'lucide-react';

interface SystemSection {
  id: 'settings' | 'users' | 'promotion' | 'analytics' | 'ads' | 'seo';
  title: string;
  description: string;
  icon: typeof Settings;
  progress: number;
  itemsCount: number;
  itemsLabel: string;
  lastUpdate: string;
}

const systemSections: SystemSection[] = [
  {
    id: 'settings',
    title: 'Настройки',
    description: 'Конфигурация и параметры системы',
    icon: Settings,
    progress: 95,
    itemsCount: 32,
    itemsLabel: 'параметра',
    lastUpdate: '1 час назад',
  },
  {
    id: 'users',
    title: 'Пользователи',
    description: 'Управление командой и правами доступа',
    icon: Users,
    progress: 80,
    itemsCount: 5,
    itemsLabel: 'пользователей',
    lastUpdate: '3 часа назад',
  },
  {
    id: 'promotion',
    title: 'Продвижение',
    description: 'Маркетинг и стратегия продвижения',
    icon: TrendingUp,
    progress: 40,
    itemsCount: 6,
    itemsLabel: 'каналов',
    lastUpdate: '2 дня назад',
  },
  {
    id: 'analytics',
    title: 'Аналитика',
    description: 'Статистика и метрики эффективности',
    icon: BarChart,
    progress: 60,
    itemsCount: 12,
    itemsLabel: 'метрик',
    lastUpdate: '30 минут назад',
  },
  {
    id: 'ads',
    title: 'Реклама',
    description: 'Рекламные объявления и монетизация',
    icon: LayoutPanelTop,
    progress: 25,
    itemsCount: 3,
    itemsLabel: 'кампании',
    lastUpdate: '1 неделю назад',
  },
  {
    id: 'seo',
    title: 'SEO',
    description: 'Поисковая оптимизация и видимость',
    icon: SearchCheck,
    progress: 70,
    itemsCount: 48,
    itemsLabel: 'правил',
    lastUpdate: '15 минут назад',
  },
];

export function SystemHub() {
  const { setBreadcrumbs, reset } = useHeaderStore();
  const { navigateTo } = useNavigationStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Дашборд', href: 'dashboard', icon: LayoutDashboard },
      { label: 'Система', icon: Wrench },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const handleSectionClick = (sectionId: SystemSection['id']) => {
    navigateTo(sectionId);
  };

  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Заголовок */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-semibold tracking-tight'>Система</h1>
        <p className='text-muted-foreground'>
          Настройки, пользователи, аналитика и инструменты управления платформой
        </p>
      </div>

      {/* Сетка системных разделов */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {systemSections.map(section => {
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
          <CardDescription>Недавние изменения в системе</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {[
              {
                text: 'Обновлены SEO правила для новых страниц',
                time: '15 минут назад',
                section: 'SEO',
              },
              {
                text: 'Добавлен новый пользователь в команду',
                time: '3 часа назад',
                section: 'Пользователи',
              },
              {
                text: 'Изменены параметры уведомлений',
                time: '1 час назад',
                section: 'Настройки',
              },
              {
                text: 'Обновлены метрики аналитики',
                time: '30 минут назад',
                section: 'Аналитика',
              },
              {
                text: 'Создана новая рекламная кампания',
                time: '1 неделю назад',
                section: 'Реклама',
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
