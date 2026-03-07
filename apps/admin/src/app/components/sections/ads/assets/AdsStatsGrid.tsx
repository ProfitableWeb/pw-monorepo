import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { DollarSign, Eye, MousePointer, TrendingUp } from 'lucide-react';

interface AdsStatsGridProps {
  totalRevenue: number;
  totalImpressions: number;
  totalClicks: number;
  averageCtr: string;
}

export function AdsStatsGrid({
  totalRevenue,
  totalImpressions,
  totalClicks,
  averageCtr,
}: AdsStatsGridProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
            <DollarSign className='size-4' />
            Доход
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            ${totalRevenue.toLocaleString()}
          </div>
          <p className='text-xs text-muted-foreground mt-1'>За текущий месяц</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
            <Eye className='size-4' />
            Показы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {(totalImpressions / 1000).toFixed(0)}K
          </div>
          <p className='text-xs text-muted-foreground mt-1'>Всего показов</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
            <MousePointer className='size-4' />
            Клики
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {totalClicks.toLocaleString()}
          </div>
          <p className='text-xs text-muted-foreground mt-1'>
            Переходов по рекламе
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
            <TrendingUp className='size-4' />
            CTR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{averageCtr}%</div>
          <p className='text-xs text-muted-foreground mt-1'>
            Средний показатель
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
