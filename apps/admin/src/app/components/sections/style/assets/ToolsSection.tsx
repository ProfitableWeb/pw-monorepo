import { Wrench, Play, BookOpen, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface ToolsSectionProps {
  onNavigate: (section: string) => void;
}

export function ToolsSection({ onNavigate }: ToolsSectionProps) {
  return (
    <div>
      <div className='flex items-center gap-2 mb-3'>
        <Wrench className='h-4 w-4 text-muted-foreground' />
        <h3 className='text-sm font-medium text-muted-foreground'>
          Инструменты
        </h3>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card
          className='cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group'
          onClick={() => onNavigate('Playground')}
        >
          <CardContent className='p-6 text-center'>
            <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors'>
              <Play className='h-6 w-6 text-primary' />
            </div>
            <h4 className='font-semibold mb-2'>Playground</h4>
            <p className='text-sm text-muted-foreground'>
              Проверьте текст на соответствие стилю
            </p>
          </CardContent>
        </Card>

        <Card
          className='cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group'
          onClick={() => onNavigate('Библиотека примеров')}
        >
          <CardContent className='p-6 text-center'>
            <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors'>
              <BookOpen className='h-6 w-6 text-primary' />
            </div>
            <h4 className='font-semibold mb-2'>Примеры</h4>
            <p className='text-sm text-muted-foreground'>
              Лучшие образцы текстов и форматов
            </p>
          </CardContent>
        </Card>

        <Card
          className='cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group'
          onClick={() => onNavigate('Аналитика стиля')}
        >
          <CardContent className='p-6 text-center'>
            <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors'>
              <BarChart3 className='h-6 w-6 text-primary' />
            </div>
            <h4 className='font-semibold mb-2'>Аналитика</h4>
            <p className='text-sm text-muted-foreground'>
              Метрики соответствия стилю
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
