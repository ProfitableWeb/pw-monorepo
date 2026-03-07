import { BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import type { StyleStats, Author } from '../style.types';

interface StyleStatusCardProps {
  styleMode: 'editorial' | 'personal';
  styleStats: StyleStats;
  currentAuthor: Author;
}

export function StyleStatusCard({
  styleMode,
  styleStats,
  currentAuthor,
}: StyleStatusCardProps) {
  return (
    <Card className='border-primary/20 bg-gradient-to-br from-primary/5 to-transparent'>
      <CardHeader>
        <CardTitle className='text-lg flex items-center gap-2'>
          <BarChart3 className='h-5 w-5 text-primary' />
          {styleMode === 'editorial'
            ? 'Статус стиля блога'
            : `Стиль: ${currentAuthor.name}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div>
            <div className='text-sm text-muted-foreground mb-2'>
              Заполненность
            </div>
            <div className='flex items-end gap-2'>
              <div className='text-3xl font-bold'>
                {styleStats.completeness}%
              </div>
              <TrendingUp className='h-5 w-5 text-green-500 mb-1' />
            </div>
            <Progress value={styleStats.completeness} className='mt-2' />
          </div>
          <div>
            <div className='text-sm text-muted-foreground mb-2'>
              Правила написания
            </div>
            <div className='text-3xl font-bold'>{styleStats.rulesCount}</div>
            <div className='text-xs text-muted-foreground mt-1'>
              в 6 категориях
            </div>
          </div>
          <div>
            <div className='text-sm text-muted-foreground mb-2'>
              Термины в словаре
            </div>
            <div className='text-3xl font-bold'>{styleStats.termsCount}</div>
            <div className='text-xs text-muted-foreground mt-1'>
              + глоссарий
            </div>
          </div>
          <div>
            <div className='text-sm text-muted-foreground mb-2'>
              Помпты изображений
            </div>
            <div className='text-3xl font-bold'>
              {styleStats.imagePromptsCount}
            </div>
            <div className='text-xs text-muted-foreground mt-1'>
              MJ, DALL-E, SD
            </div>
          </div>
        </div>
        <div className='mt-6 pt-4 border-t flex items-center justify-between'>
          <div className='flex items-center gap-2 text-sm'>
            <CheckCircle2 className='h-4 w-4 text-green-500' />
            <span className='text-muted-foreground'>
              Голос настроен • Последнее обновление: {styleStats.lastUpdated}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
