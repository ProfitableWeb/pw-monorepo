import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { cn } from '@/app/components/ui/utils';
import { Calendar, Pause, Play, Settings } from 'lucide-react';
import type { AdCampaign } from '../ads.types';
import { statusColors, statusLabels, typeLabels } from '../ads.constants';

interface CampaignCardProps {
  campaign: AdCampaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className='p-4 rounded-lg border bg-card'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-1'>
            <p className='font-medium'>{campaign.name}</p>
            <Badge
              variant='outline'
              className={cn('text-xs', statusColors[campaign.status])}
            >
              {statusLabels[campaign.status]}
            </Badge>
            <Badge variant='outline' className='text-xs'>
              {typeLabels[campaign.type]}
            </Badge>
          </div>
          <div className='flex items-center gap-3 text-sm text-muted-foreground'>
            <div className='flex items-center gap-1'>
              <Calendar className='size-3' />
              <span>
                {campaign.startDate} - {campaign.endDate}
              </span>
            </div>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button variant='ghost' size='icon'>
            {campaign.status === 'active' ? (
              <Pause className='size-4' />
            ) : (
              <Play className='size-4' />
            )}
          </Button>
          <Button variant='ghost' size='icon'>
            <Settings className='size-4' />
          </Button>
        </div>
      </div>

      {campaign.status !== 'draft' && (
        <>
          <div className='grid grid-cols-4 gap-4 mb-3 text-sm'>
            <div>
              <p className='text-muted-foreground mb-1'>Показы</p>
              <p className='font-medium'>
                {campaign.impressions.toLocaleString()}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground mb-1'>Клики</p>
              <p className='font-medium'>{campaign.clicks.toLocaleString()}</p>
            </div>
            <div>
              <p className='text-muted-foreground mb-1'>CTR</p>
              <p className='font-medium'>{campaign.ctr}%</p>
            </div>
            <div>
              <p className='text-muted-foreground mb-1'>Потрачено</p>
              <p className='font-medium'>${campaign.spent.toLocaleString()}</p>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Бюджет</span>
              <span className='font-medium'>
                ${campaign.spent.toLocaleString()} / $
                {campaign.budget.toLocaleString()}
              </span>
            </div>
            <Progress
              value={(campaign.spent / campaign.budget) * 100}
              className='h-2'
            />
          </div>
        </>
      )}
    </div>
  );
}
