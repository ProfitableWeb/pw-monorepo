import {
  format,
  isToday,
  isSameMonth,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/app/components/ui/utils';
import { WEEKDAYS } from './calendar.constants';
import { generateCalendarDays } from './calendar.utils';
import type { ScheduledPost } from './calendar.types';

interface YearViewProps {
  currentMonth: Date;
  getPostsForDay: (day: Date | null) => ScheduledPost[];
}

// Рендер годового вида
export function YearView({ currentMonth, getPostsForDay }: YearViewProps) {
  const yearStart = startOfYear(currentMonth);
  const yearMonths = eachMonthOfInterval({
    start: yearStart,
    end: endOfYear(yearStart),
  });

  return (
    <div className='grid grid-cols-4 gap-4'>
      {yearMonths.map(month => {
        const calendarDays = generateCalendarDays(month);

        return (
          <div key={month.toString()} className='space-y-2'>
            <div className='text-center font-medium text-xs'>
              {format(month, 'LLLL', { locale: ru })}
            </div>
            <div className='grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border text-[9px]'>
              {WEEKDAYS.map(day => (
                <div
                  key={day}
                  className='bg-card p-0.5 text-center font-medium text-muted-foreground'
                >
                  {day[0]}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                const dayPosts = getPostsForDay(day);
                const isCurrentDay = day && isToday(day);
                const isCurrentMonth = day && isSameMonth(day, month);

                return (
                  <div
                    key={index}
                    className={cn(
                      'min-h-[24px] p-0.5',
                      day ? 'bg-card' : 'calendar-empty-cell'
                    )}
                  >
                    {day && (
                      <>
                        <div
                          className={cn(
                            'text-[9px] font-medium',
                            isCurrentDay && 'text-primary font-bold',
                            !isCurrentMonth && 'text-muted-foreground/50'
                          )}
                        >
                          {format(day, 'd')}
                        </div>
                        {dayPosts.length > 0 && (
                          <div className='w-1 h-1 rounded-full bg-primary mx-auto mt-0.5' />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
