import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Zap, Target, Users, TrendingUp } from 'lucide-react';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Быстрые действия</CardTitle>
        <CardDescription>
          Инструменты для управления продвижением
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' size='sm'>
            <Zap className='size-4 mr-2' />
            Автопостинг
          </Button>
          <Button variant='outline' size='sm'>
            <Target className='size-4 mr-2' />
            Таргетированная реклама
          </Button>
          <Button variant='outline' size='sm'>
            <Users className='size-4 mr-2' />
            Анализ аудитории
          </Button>
          <Button variant='outline' size='sm'>
            <TrendingUp className='size-4 mr-2' />
            Отчет по продвижению
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
