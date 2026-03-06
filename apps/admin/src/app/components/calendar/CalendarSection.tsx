import { useHeaderStore } from '@/app/store/header-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';
import { useState, useEffect } from 'react';
import {
  format,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addQuarters,
  subQuarters,
  addYears,
  subYears,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar as CalendarIcon,
  Settings,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Combobox, type ComboboxOption } from '@/app/components/ui/combobox';
import { mockScheduledPosts } from './calendar.constants';
import type { ScheduledPost } from './calendar.types';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { QuarterView } from './QuarterView';
import { YearView } from './YearView';
import { CalendarSettingsDialog } from './CalendarSettingsDialog';

export function CalendarSection() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [posts, setPosts] = useState<ScheduledPost[]>(mockScheduledPosts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [calendarView, setCalendarView] = useState('month');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Стор заголовка для хлебных крошек
  const { setBreadcrumbs, reset } = useHeaderStore();

  // Установить хлебные крошки
  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.calendar());

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const getPostsForDay = (day: Date | null) => {
    if (!day) return [];
    return posts.filter(post => isSameDay(post.date, day));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const previousPeriod = () => {
    switch (calendarView) {
      case 'week':
        setCurrentMonth(subWeeks(currentMonth, 1));
        break;
      case 'month':
        setCurrentMonth(subMonths(currentMonth, 1));
        break;
      case 'quarter':
        setCurrentMonth(subQuarters(currentMonth, 1));
        break;
      case 'year':
        setCurrentMonth(subYears(currentMonth, 1));
        break;
    }
  };

  const nextPeriod = () => {
    switch (calendarView) {
      case 'week':
        setCurrentMonth(addWeeks(currentMonth, 1));
        break;
      case 'month':
        setCurrentMonth(addMonths(currentMonth, 1));
        break;
      case 'quarter':
        setCurrentMonth(addQuarters(currentMonth, 1));
        break;
      case 'year':
        setCurrentMonth(addYears(currentMonth, 1));
        break;
    }
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(parseInt(monthIndex));
    setCurrentMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(parseInt(year));
    setCurrentMonth(newDate);
  };

  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  const monthOptions: ComboboxOption[] = months.map((month, index) => ({
    value: index.toString(),
    label: month,
  }));

  const currentYear = currentMonth.getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

  const yearOptions: ComboboxOption[] = years.map(year => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const scheduledPosts = posts.filter(p => p.type === 'scheduled');
  const aiSuggestions = posts.filter(p => p.type === 'ai-suggestion');

  return (
    <div className='p-6 space-y-6'>
      {/* Заголовок */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Планирование контента</h1>
          <p className='text-muted-foreground mt-1'>
            {posts.length} запланированных публикаций • {scheduledPosts.length}{' '}
            статей • {aiSuggestions.length} AI-предложений
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Запланировать публикацию
        </Button>
      </div>

      {/* SVG Pattern Definition */}
      <svg width='0' height='0' className='absolute'>
        <defs>
          <pattern
            id='diagonal-stripes'
            patternUnits='userSpaceOnUse'
            width='8'
            height='8'
            patternTransform='rotate(45)'
          >
            <line
              x1='0'
              y1='0'
              x2='0'
              y2='8'
              stroke='hsl(var(--border))'
              strokeWidth='1'
            />
          </pattern>
        </defs>
      </svg>

      {/* Карточка календаря */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button variant='outline' size='icon' onClick={previousPeriod}>
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <div className='flex items-center gap-2'>
                <Combobox
                  options={monthOptions}
                  value={currentMonth.getMonth().toString()}
                  onValueChange={handleMonthChange}
                  placeholder='Месяц'
                  searchPlaceholder='Набор месяца...'
                  className='w-[140px]'
                />
                <Combobox
                  options={yearOptions}
                  value={currentMonth.getFullYear().toString()}
                  onValueChange={handleYearChange}
                  placeholder='Год'
                  searchPlaceholder='Набор года...'
                  className='w-[100px]'
                />
              </div>
              <Button variant='outline' size='icon' onClick={nextPeriod}>
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
            <div className='flex items-center gap-2'>
              <Select value={calendarView} onValueChange={setCalendarView}>
                <SelectTrigger className='w-[140px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='year'>Год</SelectItem>
                  <SelectItem value='quarter'>Квартал</SelectItem>
                  <SelectItem value='month'>Месяц</SelectItem>
                  <SelectItem value='week'>Неделя</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Сетка календаря */}
          {calendarView === 'week' && (
            <WeekView
              currentMonth={currentMonth}
              getPostsForDay={getPostsForDay}
            />
          )}
          {calendarView === 'month' && (
            <MonthView
              currentMonth={currentMonth}
              getPostsForDay={getPostsForDay}
            />
          )}
          {calendarView === 'quarter' && (
            <QuarterView
              currentMonth={currentMonth}
              getPostsForDay={getPostsForDay}
            />
          )}
          {calendarView === 'year' && (
            <YearView
              currentMonth={currentMonth}
              getPostsForDay={getPostsForDay}
            />
          )}
        </CardContent>
      </Card>

      {/* Нижняя секция */}
      <div className='grid gap-4 md:grid-cols-3'>
        {/* Запланированные публикации */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <CalendarIcon className='h-4 w-4' />
              Запланированные статьи
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scheduledPosts.length > 0 ? (
              <div className='space-y-2'>
                {scheduledPosts.slice(0, 5).map(post => (
                  <div key={post.id} className='text-sm'>
                    <div className='font-medium'>{post.title}</div>
                    <div className='text-xs text-muted-foreground'>
                      {format(post.date, 'd MMMM', { locale: ru })} •{' '}
                      {post.time}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>
                Нет запланированных статей
              </p>
            )}
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Sparkles className='h-4 w-4' />
              AI-предложения
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiSuggestions.length > 0 ? (
              <div className='space-y-2'>
                {aiSuggestions.map(post => (
                  <div key={post.id} className='text-sm'>
                    <div className='font-medium'>{post.title}</div>
                    <div className='text-xs text-muted-foreground'>
                      {format(post.date, 'd MMMM', { locale: ru })} •{' '}
                      {post.time}
                    </div>
                  </div>
                ))}
                <Button variant='link' className='h-auto p-0 text-xs'>
                  Просмотреть предложения
                </Button>
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>
                Нет AI-предложений
              </p>
            )}
          </CardContent>
        </Card>

        {/* Легенда */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Легенда</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-sm bg-blue-500/40 border border-blue-500/50'></div>
                <span className='text-sm'>Запланированная статья</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-sm bg-purple-500/40 border border-purple-500/50'></div>
                <span className='text-sm'>AI-редложение</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-sm bg-green-500/40 border border-green-500/50'></div>
                <span className='text-sm'>Событие</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Диалог настроек */}
      <CalendarSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
}
