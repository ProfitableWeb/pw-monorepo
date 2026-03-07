import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Eye, Heart } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

import type { Campaign } from './promotion.types';
import { statusColors, statusLabels } from './promotion.constants';

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className='p-4 rounded-lg border bg-card'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-1'>
            <p className='font-medium'>{campaign.title}</p>
            <Badge
              variant='outline'
              className={cn('text-xs', statusColors[campaign.status])}
            >
              {statusLabels[campaign.status]}
            </Badge>
          </div>
          <p className='text-sm text-muted-foreground'>
            {campaign.channel} • {campaign.startDate}
          </p>
        </div>
        <Button variant='ghost' size='sm'>
          Подробнее
        </Button>
      </div>
      {campaign.status !== 'scheduled' && (
        <>
          <div className='space-y-2 mb-3'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Прогресс</span>
              <span className='font-medium'>{campaign.progress}%</span>
            </div>
            <Progress value={campaign.progress} className='h-2' />
          </div>
          <div className='flex items-center gap-6 text-sm'>
            <div className='flex items-center gap-2'>
              <Eye className='size-4 text-muted-foreground' />
              <span>{campaign.reach.toLocaleString()} охват</span>
            </div>
            <div className='flex items-center gap-2'>
              <Heart className='size-4 text-muted-foreground' />
              <span>{campaign.engagement}% вовлеченность</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
