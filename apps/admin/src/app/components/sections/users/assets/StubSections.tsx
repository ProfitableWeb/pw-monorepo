import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Ban,
  Settings,
  Activity,
  CheckCircle,
  HeadphonesIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { users, roleLabels, roleIcons } from '../users.constants';
import type { User } from '../users.types';

// Заглушка: Комментарии
export function CommentsSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Комментарии
        </h2>
        <p className='text-muted-foreground'>
          Модерация комментариев пользователей
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Последние комментарии</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>Функционал в разработке</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Заглушка: Чёрный список
export function BlacklistSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Чёрный список
        </h2>
        <p className='text-muted-foreground'>
          Заблокированные пользователи и IP-адреса
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Ban className='size-5 text-destructive' />
            Заблокированные
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Нет заблокированных пользователей
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Заглушка: Роли и права
export function RolesSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Роли и права
        </h2>
        <p className='text-muted-foreground'>Настройка ролей и прав доступа</p>
      </div>

      <div className='grid gap-4'>
        {['admin', 'editor', 'author', 'viewer'].map(role => {
          const RoleIcon = roleIcons[role as User['role']];
          return (
            <Card key={role}>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <RoleIcon className='size-5' />
                  {roleLabels[role as User['role']]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground mb-3'>
                  Пользователей с этой ролью:{' '}
                  {users.filter(u => u.role === role).length}
                </p>
                <Button variant='outline' size='sm'>
                  <Settings className='h-4 w-4 mr-2' />
                  Настроить права
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Заглушка: Активность
export function ActivitySection() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Активность
        </h2>
        <p className='text-muted-foreground'>
          История действий и логи пользователей
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='size-5' />
            Журнал активности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {users.slice(0, 5).map(user => (
              <div
                key={user.id}
                className='flex items-center gap-3 p-2 rounded-lg border'
              >
                <Avatar className='h-8 w-8'>
                  <AvatarFallback className='text-xs'>
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{user.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {user.lastActive}
                  </p>
                </div>
                <CheckCircle className='h-4 w-4 text-green-500' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Заглушка: Служба поддержки
export function SupportSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Служба поддержки
        </h2>
        <p className='text-muted-foreground'>
          Обращения и запросы пользователей
        </p>
      </div>
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Открытых тикетов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              В работе
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Решено сегодня
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>12</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <HeadphonesIcon className='size-5' />
            Последние обращения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>Нет новых обращений</p>
        </CardContent>
      </Card>
    </div>
  );
}
