import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Crown, PenTool, BookOpen, Eye } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { users } from './users.constants';

// Раздел команды
export function TeamSection() {
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
            <div className='text-3xl font-bold mb-2'>
              {users.filter(u => u.role === 'admin').length}
            </div>
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
            <div className='text-3xl font-bold mb-2'>
              {users.filter(u => u.role === 'editor').length}
            </div>
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
            <div className='text-3xl font-bold mb-2'>
              {users.filter(u => u.role === 'author').length}
            </div>
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
            <div className='text-3xl font-bold mb-2'>
              {users.filter(u => u.role === 'viewer').length}
            </div>
            <p className='text-sm text-muted-foreground'>человек</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Организационная структура</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {['Управление', 'Редакция', 'Контент', 'Наблюдатели'].map(dept => {
              const deptUsers = users.filter(u => u.department === dept);
              return (
                <div key={dept} className='border-l-4 border-primary pl-4'>
                  <h3 className='font-medium mb-2'>{dept}</h3>
                  <div className='flex -space-x-2'>
                    {deptUsers.map(user => (
                      <Avatar
                        key={user.id}
                        className='h-8 w-8 border-2 border-background'
                      >
                        <AvatarFallback className='text-xs'>
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
