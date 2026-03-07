import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

import type { Channel } from './promotion.types';

interface ChannelCardProps {
  channel: Channel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
  const Icon = channel.icon;

  return (
    <div className='p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-center gap-3'>
          <div className={cn('p-2 rounded-lg bg-muted/50', channel.color)}>
            <Icon className='size-5' />
          </div>
          <div>
            <p className='font-medium'>{channel.name}</p>
            <Badge
              variant='outline'
              className={cn(
                'text-xs mt-1',
                channel.status === 'active'
                  ? 'bg-green-500/10 text-green-500 border-green-500/20'
                  : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
              )}
            >
              {channel.status === 'active' ? 'Активен' : 'Пауза'}
            </Badge>
          </div>
        </div>
        <Button variant='ghost' size='icon'>
          <ExternalLink className='size-4' />
        </Button>
      </div>
      <div className='grid grid-cols-2 gap-3 text-sm'>
        <div>
          <p className='text-muted-foreground mb-1'>Подписчики</p>
          <p className='font-medium'>{channel.subscribers.toLocaleString()}</p>
        </div>
        <div>
          <p className='text-muted-foreground mb-1'>Вовлеченность</p>
          <p className='font-medium'>{channel.engagement}%</p>
        </div>
        <div>
          <p className='text-muted-foreground mb-1'>Публикаций</p>
          <p className='font-medium'>{channel.posts}</p>
        </div>
        <div>
          <p className='text-muted-foreground mb-1'>Охват</p>
          <p className='font-medium'>{(channel.reach / 1000).toFixed(0)}K</p>
        </div>
      </div>
    </div>
  );
}
