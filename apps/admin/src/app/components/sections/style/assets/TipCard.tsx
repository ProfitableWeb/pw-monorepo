import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

export function TipCard() {
  return (
    <Card className='border-primary/20 bg-primary/5'>
      <CardContent className='p-6'>
        <div className='flex gap-3'>
          <Sparkles className='h-5 w-5 text-primary flex-shrink-0 mt-0.5' />
          <div>
            <h4 className='font-medium mb-2'>Совет</h4>
            <p className='text-sm text-muted-foreground'>
              Настройки стиля автоматически применяются во всех инструментах
              работы с текстом. AI Center использует эти правила для генерации
              контента, а редактор статей — для проверки текстов.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
