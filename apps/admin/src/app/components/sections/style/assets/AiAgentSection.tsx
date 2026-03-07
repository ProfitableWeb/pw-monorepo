import { Bot, Copy, Send, Download } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import type { StyleStats } from '../style.types';

interface AiAgentSectionProps {
  styleStats: StyleStats;
}

export function AiAgentSection({ styleStats }: AiAgentSectionProps) {
  return (
    <div>
      <div className='flex items-center gap-2 mb-3'>
        <Bot className='h-4 w-4 text-muted-foreground' />
        <h3 className='text-sm font-medium text-muted-foreground'>
          Для ИИ-агента
        </h3>
      </div>
      <Card className='border-dashed'>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <div className='w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0'>
              <Bot className='h-6 w-6 text-muted-foreground' />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='font-semibold'>Системный промпт</h4>
                <Badge variant='outline' className='text-xs'>
                  Обновлён: {styleStats.lastUpdated}
                </Badge>
              </div>
              <p className='text-sm text-muted-foreground mb-4'>
                Автоматически сгенерированные инструкции на основе всех настроек
                стиля
              </p>
              <div className='bg-muted/50 rounded-lg p-4 mb-4 font-mono text-xs'>
                <div className='text-muted-foreground'>
                  Ты редактор блога о современных технолгиях.
                  <br />
                  TONE: Формальность 8/10, Энергичность 7/10...
                  <br />
                  ПРАВИЛА: Используй активный залог, избегай "юзер"...
                  <br />
                  <span className='text-primary'>
                    ... ещё {styleStats.rulesCount} правил
                  </span>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm' className='gap-2'>
                  <Copy className='h-4 w-4' />
                  Копировать
                </Button>
                <Button variant='outline' size='sm' className='gap-2'>
                  <Send className='h-4 w-4' />
                  Отправить в AI Center
                </Button>
                <Button variant='outline' size='sm' className='gap-2'>
                  <Download className='h-4 w-4' />
                  Экспорт
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
