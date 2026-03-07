import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Eye, Users, Clock, ArrowDown, ArrowUp } from 'lucide-react';

export function StatsCards() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
            <Eye className='size-4' />
            Просмотры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>45,231</div>
          <p className='text-xs text-muted-foreground mt-1 flex items-center gap-1'>
            <ArrowUp className='size-3 text-green-500' />
            <span className='text-green-500'>+12.5%</span> за месяц
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
            <Users className='size-4' />
            Посетители
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>32,450</div>
          <p className='text-xs text-muted-foreground mt-1 flex items-center gap-1'>
            <ArrowUp className='size-3 text-green-500' />
            <span className='text-green-500'>+8.2%</span> за месяц
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
            <Clock className='size-4' />
            ремя на сайте
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>4:32</div>
          <p className='text-xs text-muted-foreground mt-1 flex items-center gap-1'>
            <ArrowUp className='size-3 text-green-500' />
            <span className='text-green-500'>+15s</span> за месяц
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
            <ArrowDown className='size-4' />
            Отказы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>32.5%</div>
          <p className='text-xs text-muted-foreground mt-1 flex items-center gap-1'>
            <ArrowDown className='size-3 text-green-500' />
            <span className='text-green-500'>-2.1%</span> за месяц
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
