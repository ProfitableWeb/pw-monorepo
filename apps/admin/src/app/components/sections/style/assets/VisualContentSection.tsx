import {
  Image as ImageIcon,
  ArrowRight,
  Newspaper,
  FileImage,
  BarChart3,
  Paintbrush,
} from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

interface VisualContentSectionProps {
  onNavigate: (section: string) => void;
}

export function VisualContentSection({
  onNavigate,
}: VisualContentSectionProps) {
  return (
    <div>
      <div className='flex items-center gap-2 mb-3'>
        <ImageIcon className='h-4 w-4 text-muted-foreground' />
        <h3 className='text-sm font-medium text-muted-foreground'>
          Визуальный контент
        </h3>
      </div>
      <Card
        className='cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group'
        onClick={() => onNavigate('Промпты для изображени')}
      >
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <div className='w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-muted/80 transition-colors'>
              <ImageIcon className='h-6 w-6 text-muted-foreground' />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='font-semibold'>Промпты для изображений</h4>
                <ArrowRight className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
              </div>
              <p className='text-sm text-muted-foreground mb-3'>
                Готовые промпты для генерации обложек, миниатюр, схем и
                иллюстраций
              </p>
              <div className='flex flex-wrap gap-2'>
                <Badge
                  variant='outline'
                  className='text-xs flex items-center gap-1'
                >
                  <Newspaper className='h-3 w-3' />
                  Обложки
                </Badge>
                <Badge
                  variant='outline'
                  className='text-xs flex items-center gap-1'
                >
                  <FileImage className='h-3 w-3' />
                  Миниатюры
                </Badge>
                <Badge
                  variant='outline'
                  className='text-xs flex items-center gap-1'
                >
                  <BarChart3 className='h-3 w-3' />
                  Схемы
                </Badge>
                <Badge
                  variant='outline'
                  className='text-xs flex items-center gap-1'
                >
                  <Paintbrush className='h-3 w-3' />
                  Иллюстрации
                </Badge>
              </div>
              <div className='flex items-center gap-3 mt-3 text-xs text-muted-foreground'>
                <span>MidJourney</span>
                <span>•</span>
                <span>DALL-E 3</span>
                <span>•</span>
                <span>Stable Diffusion</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
