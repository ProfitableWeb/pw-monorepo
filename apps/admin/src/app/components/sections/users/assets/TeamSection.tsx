import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Crown, PenTool, BookOpen, Eye, Loader2 } from 'lucide-react';
import { useAdminUserStats } from '../useAdminUsers';

export function TeamSection() {
  const { data: stats, isLoading } = useAdminUserStats();
  const byRole = stats?.byRole ?? {};

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12 text-muted-foreground'>
        <Loader2 className='size-5 animate-spin mr-2' />
        Загрузка...
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Команда издания
        </h2>
        <p className='text-muted-foreground'>
          Структура редакции и распределение по отделам
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Crown className='size-5 text-red-500' />
              Управление
            </CardTitle>
            <CardDescription>Администраторы системы</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold mb-2'>{byRole.admin ?? 0}</div>
            <p className='text-sm text-muted-foreground'>человек</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <PenTool className='size-5 text-blue-500' />
              Редакция
            </CardTitle>
            <CardDescription>Главные редакторы</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold mb-2'>{byRole.editor ?? 0}</div>
            <p className='text-sm text-muted-foreground'>человек</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BookOpen className='size-5 text-green-500' />
              Контент
            </CardTitle>
            <CardDescription>Авторы и журналисты</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold mb-2'>{byRole.author ?? 0}</div>
            <p className='text-sm text-muted-foreground'>человек</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Eye className='size-5 text-gray-500' />
              Наблюдатели
            </CardTitle>
            <CardDescription>Только просмотр</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold mb-2'>{byRole.viewer ?? 0}</div>
            <p className='text-sm text-muted-foreground'>человек</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
