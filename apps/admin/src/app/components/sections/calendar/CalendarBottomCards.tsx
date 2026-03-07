import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import type { ScheduledPost } from './calendar.types';

interface CalendarBottomCardsProps {
  scheduledPosts: ScheduledPost[];
  aiSuggestions: ScheduledPost[];
}

export function CalendarBottomCards({
  scheduledPosts,
  aiSuggestions,
}: CalendarBottomCardsProps) {
  return (
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
                    {format(post.date, 'd MMMM', { locale: ru })} • {post.time}
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

      {/* AI-предложения */}
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
                    {format(post.date, 'd MMMM', { locale: ru })} • {post.time}
                  </div>
                </div>
              ))}
              <Button variant='link' className='h-auto p-0 text-xs'>
                Просмотреть предложения
              </Button>
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>Нет AI-предложений</p>
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
  );
}
