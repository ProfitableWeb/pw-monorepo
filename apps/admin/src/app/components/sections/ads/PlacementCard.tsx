import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import type { AdPlacement } from './ads.types';

interface PlacementCardProps {
  placement: AdPlacement;
}

export function PlacementCard({ placement }: PlacementCardProps) {
  return (
    <div className='p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors'>
      <div className='flex items-start justify-between mb-3'>
        <div>
          <p className='font-medium mb-1'>{placement.name}</p>
          <p className='text-sm text-muted-foreground'>{placement.location}</p>
        </div>
        <Badge variant='outline' className='text-xs'>
          {placement.format}
        </Badge>
      </div>
      <div className='grid grid-cols-3 gap-3 text-sm mb-3'>
        <div>
          <p className='text-muted-foreground mb-1'>Показы</p>
          <p className='font-medium'>
            {(placement.impressions / 1000).toFixed(0)}K
          </p>
        </div>
        <div>
          <p className='text-muted-foreground mb-1'>Доход</p>
          <p className='font-medium'>${placement.revenue}</p>
        </div>
        <div>
          <p className='text-muted-foreground mb-1'>Fill Rate</p>
          <p className='font-medium'>{placement.fillRate}%</p>
        </div>
      </div>
      <div className='space-y-1'>
        <div className='flex items-center justify-between text-xs'>
          <span className='text-muted-foreground'>Заполненность</span>
          <span className='font-medium'>{placement.fillRate}%</span>
        </div>
        <Progress value={placement.fillRate} className='h-1.5' />
      </div>
    </div>
  );
}
