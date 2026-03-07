import {
  format,
  eachDayOfInterval,
  isToday,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/app/components/ui/utils';
import { WEEKDAYS } from '../calendar.constants';
import { getPostColor } from '../calendar.utils';
import type { ScheduledPost } from '../calendar.types';

interface WeekViewProps {
  currentMonth: Date;
  getPostsForDay: (day: Date | null) => ScheduledPost[];
}

// Рендер недельного вида
export function WeekView({ currentMonth, getPostsForDay }: WeekViewProps) {
  const weekStart = startOfWeek(currentMonth, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentMonth, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

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
      {weekDays.map((day, index) => {
        const dayPosts = getPostsForDay(day);
        const isCurrentDay = isToday(day);

        return (
          <div key={index} className='min-h-[200px] bg-card p-2'>
            <div
              className={cn(
                'text-sm font-medium mb-2',
                isCurrentDay && 'text-primary font-bold'
              )}
            >
              {format(day, 'd MMM', { locale: ru })}
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
          </div>
        );
      })}
    </div>
  );
}
