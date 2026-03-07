import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { QuarterView } from './QuarterView';
import { YearView } from './YearView';
import { CalendarSettingsDialog } from './CalendarSettingsDialog';
import { CalendarHeader } from './CalendarHeader';
import { CalendarBottomCards } from './CalendarBottomCards';
import { useCalendarState } from './useCalendarState';

export function CalendarSection() {
  const {
    currentMonth,
    posts,
    setPosts: _setPosts,
    isDialogOpen: _isDialogOpen,
    setIsDialogOpen,
    calendarView,
    setCalendarView,
    isSettingsOpen,
    setIsSettingsOpen,
    getPostsForDay,
    goToToday: _goToToday,
    previousPeriod,
    nextPeriod,
    previousMonth: _previousMonth,
    nextMonth: _nextMonth,
    handleMonthChange,
    handleYearChange,
    monthOptions,
    yearOptions,
    scheduledPosts,
    aiSuggestions,
  } = useCalendarState();

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
        <CalendarHeader
          currentMonth={currentMonth}
          calendarView={calendarView}
          setCalendarView={setCalendarView}
          previousPeriod={previousPeriod}
          nextPeriod={nextPeriod}
          handleMonthChange={handleMonthChange}
          handleYearChange={handleYearChange}
          monthOptions={monthOptions}
          yearOptions={yearOptions}
          onSettingsOpen={() => setIsSettingsOpen(true)}
        />
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
      <CalendarBottomCards
        scheduledPosts={scheduledPosts}
        aiSuggestions={aiSuggestions}
      />

      {/* Диалог настроек */}
      <CalendarSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
}
