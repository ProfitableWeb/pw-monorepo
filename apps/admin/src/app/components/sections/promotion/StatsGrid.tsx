import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

import { campaigns, channels } from './promotion.constants';

export function StatsGrid() {
  const totalSubscribers = channels.reduce(
    (sum, ch) => sum + ch.subscribers,
    0
  );
  const averageEngagement = (
    channels.reduce((sum, ch) => sum + ch.engagement, 0) / channels.length
  ).toFixed(1);
  const totalReach = channels.reduce((sum, ch) => sum + ch.reach, 0);

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            Подписчики
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {totalSubscribers.toLocaleString()}
          </div>
          <p className='text-xs text-muted-foreground mt-1 flex items-center gap-1'>
            <ArrowUpRight className='size-3 text-green-500' />
            +12% за месяц
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            Вовлеченность
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{averageEngagement}%</div>
          <p className='text-xs text-muted-foreground mt-1 flex items-center gap-1'>
            <ArrowUpRight className='size-3 text-green-500' />
            +0.8% за месяц
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            Охват
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {(totalReach / 1000).toFixed(0)}K
          </div>
          <p className='text-xs text-muted-foreground mt-1'>
            За последние 30 дней
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            Активные кампании
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {campaigns.filter(c => c.status === 'active').length}
          </div>
          <p className='text-xs text-muted-foreground mt-1'>
            {campaigns.filter(c => c.status === 'scheduled').length}{' '}
            запланировано
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
