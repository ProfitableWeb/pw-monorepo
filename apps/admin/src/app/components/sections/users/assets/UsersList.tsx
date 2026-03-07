import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Users,
  UserPlus,
  Mail,
  Clock,
  MoreVertical,
  Filter,
  UserCog,
  Eye,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import {
  users,
  roleLabels,
  roleIcons,
  roleColors,
  statusLabels,
  statusColors,
} from '../users.constants';

// Компонент списка пользователей
export function UsersList({ searchQuery }: { searchQuery: string }) {
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(
      user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalArticles = users.reduce((sum, u) => sum + u.articlesCount, 0);

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Список пользователей
        </h2>
        <p className='text-muted-foreground'>
          Управление всеми пользователями системы
        </p>
      </div>

      {/* Статистика */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
              <Users className='size-4' />
              Всего пользователей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
              <CheckCircle className='size-4' />
              Активных
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {activeUsers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
              <AlertCircle className='size-4' />
              Приглашено
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>
              {users.filter(u => u.status === 'invited').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
              <FileText className='size-4' />
              Всего статей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalArticles}</div>
          </CardContent>
        </Card>
      </div>

      {/* Действия */}
      <div className='flex items-center gap-2'>
        <Button>
          <UserPlus className='h-4 w-4 mr-2' />
          Пригласить пользователя
        </Button>
        <Button variant='outline'>
          <Filter className='h-4 w-4 mr-2' />
          Фильтры
        </Button>
      </div>

      {/* Список пользователей */}
      <div className='space-y-3'>
        {filteredUsers.map(user => {
          const RoleIcon = roleIcons[user.role];

          return (
            <div
              key={user.id}
              className='group flex items-center gap-4 p-4 rounded-lg border bg-card transition-all hover:shadow-md'
            >
              <Avatar className='h-12 w-12 flex-shrink-0'>
                <AvatarFallback className='text-base font-medium'>
                  {user.avatar}
                </AvatarFallback>
              </Avatar>

              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <h3 className='font-medium truncate'>{user.name}</h3>
                  <Badge
                    variant='outline'
                    className={cn('text-xs', roleColors[user.role])}
                  >
                    <RoleIcon className='size-3 mr-1' />
                    {roleLabels[user.role]}
                  </Badge>
                  <Badge
                    variant='outline'
                    className={cn('text-xs', statusColors[user.status])}
                  >
                    {statusLabels[user.status]}
                  </Badge>
                </div>
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <span className='flex items-center gap-1'>
                    <Mail className='size-3' />
                    {user.email}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Clock className='size-3' />
                    {user.lastActive}
                  </span>
                  {user.articlesCount > 0 && (
                    <span className='flex items-center gap-1'>
                      <FileText className='size-3' />
                      {user.articlesCount} статей
                    </span>
                  )}
                </div>
              </div>

              <div className='flex-shrink-0'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size='icon' variant='ghost' className='h-8 w-8'>
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem>
                      <Eye className='h-4 w-4 mr-2' />
                      Просмотр профиля
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className='h-4 w-4 mr-2' />
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserCog className='h-4 w-4 mr-2' />
                      Изменить роль
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='text-destructive'>
                      <Trash2 className='h-4 w-4 mr-2' />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
