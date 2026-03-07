import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Globe } from 'lucide-react';
import { sourceData } from '../analytics.constants';

export function TrafficSources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Источники трафика</CardTitle>
        <CardDescription>Откуда приходят посетители</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {sourceData.map((source, index) => (
            <div key={index} className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <div className='flex items-center gap-2'>
                  <Globe className='size-4 text-muted-foreground' />
                  <span className='font-medium'>{source.source}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-muted-foreground'>
                    {source.visits.toLocaleString()} визитов
                  </span>
                  <span className='font-medium min-w-[3rem] text-right'>
                    {source.percentage}%
                  </span>
                </div>
              </div>
              <div className='h-2 bg-muted rounded-full overflow-hidden'>
                <div
                  className='h-full bg-primary transition-all'
                  style={{ width: `${source.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
