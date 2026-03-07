import {
  Palette,
  Sliders,
  FileCheck,
  BookMarked,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import type { StyleStats } from './style.types';

interface MainSettingsSectionProps {
  styleStats: StyleStats;
  onNavigate: (section: string) => void;
}

export function MainSettingsSection({
  styleStats,
  onNavigate,
}: MainSettingsSectionProps) {
  return (
    <div>
      <div className='flex items-center gap-2 mb-3'>
        <Palette className='h-4 w-4 text-muted-foreground' />
        <h3 className='text-sm font-medium text-muted-foreground'>
          Основные настройки
        </h3>
      </div>
      <div className='space-y-3'>
        <Card
          className='cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group'
          onClick={() => onNavigate('Голос и тон')}
        >
          <CardContent className='p-6'>
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-muted/80 transition-colors'>
                <Sliders className='h-6 w-6 text-muted-foreground' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-semibold'>Голос и тон</h4>
                  <ArrowRight className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
                </div>
                <p className='text-sm text-muted-foreground mb-3'>
                  Определите характер вашего блога чрез настройки голоса
                </p>
                <div className='flex flex-wrap gap-2 text-xs'>
                  <Badge variant='secondary'>Формальность: 8/10</Badge>
                  <Badge variant='secondary'>Энергичность: 7/10</Badge>
                  <Badge variant='secondary'>Экспертность: 9/10</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className='cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group'
          onClick={() => onNavigate('Правила написания')}
        >
          <CardContent className='p-6'>
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-muted/80 transition-colors'>
                <FileCheck className='h-6 w-6 text-muted-foreground' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-semibold'>Правила написания</h4>
                  <ArrowRight className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
                </div>
                <p className='text-sm text-muted-foreground mb-3'>
                  Грамматика, форматирование, стилистика и стандарты качеств
                </p>
                <div className='flex items-center gap-4 text-sm'>
                  <div className='flex items-center gap-1.5'>
                    <div className='w-2 h-2 rounded-full bg-green-500'></div>
                    <span className='text-muted-foreground'>
                      {styleStats.rulesCount} правила
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <div className='w-2 h-2 rounded-full bg-blue-500'></div>
                    <span className='text-muted-foreground'>6 категорий</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className='cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group'
          onClick={() => onNavigate('Терминология и словарь')}
        >
          <CardContent className='p-6'>
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-muted/80 transition-colors'>
                <BookMarked className='h-6 w-6 text-muted-foreground' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-semibold'>Терминология и словарь</h4>
                  <ArrowRight className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
                </div>
                <p className='text-sm text-muted-foreground mb-3'>
                  Предпочитаемые термины, глоссарий и единый язык издания
                </p>
                <div className='flex items-center gap-4 text-sm'>
                  <div className='flex items-center gap-1.5'>
                    <CheckCircle2 className='h-4 w-4 text-green-500' />
                    <span className='text-muted-foreground'>
                      {styleStats.termsCount} терминов
                    </span>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Обновлено: 2 дня назад
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
