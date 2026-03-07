import {
  format,
  isToday,
  isSameMonth,
  startOfQuarter,
  endOfQuarter,
  eachMonthOfInterval,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/app/components/ui/utils';
import { WEEKDAYS } from '../calendar.constants';
import { generateCalendarDays } from '../calendar.utils';
import type { ScheduledPost } from '../calendar.types';

interface QuarterViewProps {
  currentMonth: Date;
  getPostsForDay: (day: Date | null) => ScheduledPost[];
}

// Рендер квартального вида
export function QuarterView({
  currentMonth,
  getPostsForDay,
}: QuarterViewProps) {
  const quarterStart = startOfQuarter(currentMonth);
  const quarterMonths = eachMonthOfInterval({
    start: quarterStart,
    end: endOfQuarter(quarterStart),
  });

  return (
    <div className='grid grid-cols-3 gap-4'>
      {quarterMonths.map(month => {
        const calendarDays = generateCalendarDays(month);

        return (
          <div key={month.toString()} className='space-y-2'>
            <div className='text-center font-medium text-sm'>
              {format(month, 'LLLL yyyy', { locale: ru })}
            </div>
            <div className='grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border text-[10px]'>
              {WEEKDAYS.map(day => (
                <div
                  key={day}
                  className='bg-card p-1 text-center font-medium text-muted-foreground'
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
                      'min-h-[40px] p-0.5',
                      day ? 'bg-card' : 'calendar-empty-cell'
                    )}
                  >
                    {day && (
                      <>
                        <div
                          className={cn(
                            'text-[10px] font-medium',
                            isCurrentDay && 'text-primary font-bold',
                            !isCurrentMonth && 'text-muted-foreground/50'
                          )}
                        >
                          {format(day, 'd')}
                        </div>
                        {dayPosts.length > 0 && (
                          <div className='flex gap-0.5 mt-0.5'>
                            {dayPosts.slice(0, 3).map(post => (
                              <div
                                key={post.id}
                                className={cn(
                                  'w-1.5 h-1.5 rounded-full',
                                  post.type === 'scheduled' && 'bg-blue-500',
                                  post.type === 'ai-suggestion' &&
                                    'bg-purple-500',
                                  post.type === 'event' && 'bg-green-500'
                                )}
                              />
                            ))}
                          </div>
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
