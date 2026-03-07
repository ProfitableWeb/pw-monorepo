import { format, isToday, isSameMonth } from 'date-fns';
import { cn } from '@/app/components/ui/utils';
import { WEEKDAYS } from '../calendar.constants';
import { generateCalendarDays, getPostColor } from '../calendar.utils';
import type { ScheduledPost } from '../calendar.types';

interface MonthViewProps {
  currentMonth: Date;
  getPostsForDay: (day: Date | null) => ScheduledPost[];
}

// Рендер месячного вида
export function MonthView({ currentMonth, getPostsForDay }: MonthViewProps) {
  const calendarDays = generateCalendarDays(currentMonth);

  return (
    <div className='grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border'>
      {WEEKDAYS.map(day => (
        <div
          key={day}
          className='bg-card p-3 text-center text-sm font-medium text-muted-foreground'
        >
          {day}
        </div>
      ))}
      {calendarDays.map((day, index) => {
        const dayPosts = getPostsForDay(day);
        const isCurrentDay = day && isToday(day);
        const isCurrentMonth = day && isSameMonth(day, currentMonth);

        return (
          <div
            key={index}
            className={cn(
              'min-h-[120px] p-2',
              day ? 'bg-card' : 'calendar-empty-cell'
            )}
          >
            {day && (
              <>
                <div
                  className={cn(
                    'text-sm font-medium mb-2',
                    isCurrentDay && 'text-primary font-bold',
                    !isCurrentMonth && 'text-muted-foreground/50'
                  )}
                >
                  {format(day, 'd')}
                </div>
                <div className='space-y-1'>
                  {dayPosts.map(post => (
                    <div
                      key={post.id}
                      className={cn(
                        'text-xs p-1.5 rounded border cursor-pointer hover:opacity-80 transition-opacity',
                        getPostColor(post.type)
                      )}
                    >
                      <div className='font-medium truncate'>{post.title}</div>
                      <div className='text-[10px] opacity-70 mt-0.5'>
                        {post.time}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
