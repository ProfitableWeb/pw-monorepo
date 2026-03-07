import { Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { ScrollArea } from '@/app/components/ui/scroll-area';

interface SubSectionPlaceholderProps {
  title: string;
  onBack: () => void;
}

export function SubSectionPlaceholder({
  title,
  onBack,
}: SubSectionPlaceholderProps) {
  return (
    <div className='flex-1 overflow-hidden'>
      <ScrollArea className='h-full'>
        <div className='max-w-5xl mx-auto p-6 space-y-6'>
          <div>
            <Button variant='ghost' onClick={onBack} className='mb-4'>
              ← Назад к обзору стиля
            </Button>
            <h2 className='text-2xl font-semibold mb-2'>{title}</h2>
            <p className='text-muted-foreground'>
              Детальная страница раздела будет реализована позже
            </p>
          </div>

          {/* Placeholder для будущего контента */}
          <Card>
            <CardHeader>
              <CardTitle>Раздел в разработке</CardTitle>
              <CardDescription>
                Здесь будет полнофункциональный интерфейс для настройки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-center py-12 text-muted-foreground'>
                <Sparkles className='h-12 w-12' />
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
