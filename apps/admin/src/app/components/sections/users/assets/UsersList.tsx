import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import {
  Users,
  UserPlus,
  Mail,
  Clock,
  MoreVertical,
  Filter,
  UserCog,
  Edit,
  Trash2,
  FileText,
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  Power,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { LoadingSpinner } from '@/app/components/common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';
import { toast } from 'sonner';
import {
  roleLabels,
  roleIcons,
  roleColors,
  statusLabels,
  statusColors,
} from '../users.constants';
import { formatRelativeTime, getInitials } from '../users.utils';
import {
  useAdminUsers,
  useAdminUserStats,
  useUpdateUser,
} from '../useAdminUsers';
import { EditUserDialog } from './EditUserDialog';
import { DeactivateUserDialog } from './DeactivateUserDialog';
import type { UserBrief, UserStatus } from '../users.types';

/** Компактная статистика в шапке */
function StatsBar({
  total,
  active,
  inactive,
  totalArticles,
  isLoading,
}: {
  total: number;
  active: number;
  inactive: number;
  totalArticles: number;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className='flex items-center gap-2 text-muted-foreground'>
        <Loader2 className='size-4 animate-spin' />
        <span className='text-sm'>Загрузка...</span>
      </div>
    );
  }

  return (
    <div className='flex items-baseline gap-6'>
      <div className='flex items-baseline gap-1.5'>
        <span className='text-2xl font-bold'>{total}</span>
        <span className='text-sm text-muted-foreground'>всего</span>
      </div>
      <div className='flex items-baseline gap-1.5'>
        <span className='text-2xl font-bold text-green-600'>{active}</span>
        <span className='text-sm text-muted-foreground'>активных</span>
      </div>
      <div className='flex items-baseline gap-1.5'>
        <span className='text-2xl font-bold text-gray-500'>{inactive}</span>
        <span className='text-sm text-muted-foreground'>неактивных</span>
      </div>
      <div className='flex items-baseline gap-1.5'>
        <span className='text-2xl font-bold'>{totalArticles}</span>
        <span className='text-sm text-muted-foreground'>статей</span>
      </div>
    </div>
  );
}

/** Карточка пользователя */
function UserCard({
  user,
  onEdit,
  onDeactivate,
  onActivate,
  onClick,
}: {
  user: UserBrief;
  onEdit: (user: UserBrief) => void;
  onDeactivate: (user: UserBrief) => void;
  onActivate: (user: UserBrief) => void;
  onClick: (userId: string, userName: string) => void;
}) {
  const RoleIcon = roleIcons[user.role];
  const status: UserStatus = user.isActive ? 'active' : 'inactive';

  return (
    <div
      className='group flex items-center gap-4 px-4 py-3 border-b last:border-b-0 transition-colors hover:bg-accent/30 cursor-pointer'
      onClick={() => onClick(user.id, user.name)}
    >
      <Avatar className='size-10 flex-shrink-0'>
        {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
        <AvatarFallback className='text-sm font-medium'>
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <h3 className='font-medium truncate text-sm'>{user.name}</h3>
          <Badge
            variant='outline'
            className={cn('text-xs py-0 h-5', roleColors[user.role])}
          >
            <RoleIcon className='size-3 mr-1' />
            {roleLabels[user.role]}
          </Badge>
          <Badge
            variant='outline'
            className={cn('text-xs py-0 h-5', statusColors[status])}
          >
            {statusLabels[status]}
          </Badge>
        </div>
        <div className='flex items-center gap-4 text-xs text-muted-foreground mt-0.5'>
          <span className='flex items-center gap-1'>
            <Mail className='size-3' />
            {user.email}
          </span>
          <span className='flex items-center gap-1'>
            <Clock className='size-3' />
            {formatRelativeTime(user.lastLoginAt)}
          </span>
          {user.articlesCount > 0 && (
            <span className='flex items-center gap-1'>
              <FileText className='size-3' />
              {user.articlesCount} статей
            </span>
          )}
        </div>
      </div>

      <div className='flex-shrink-0' onClick={e => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='ghost' className='h-8 w-8'>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Edit className='h-4 w-4 mr-2' />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <UserCog className='h-4 w-4 mr-2' />
              Изменить роль
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.isActive ? (
              <DropdownMenuItem
                className='text-destructive'
                onClick={() => onDeactivate(user)}
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Деактивировать
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className='text-green-600'
                onClick={() => onActivate(user)}
              >
                <Power className='h-4 w-4 mr-2' />
                Активировать
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/** Панель фильтров */
function FilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: boolean | undefined;
  onFilterChange: (value: boolean | undefined) => void;
}) {
  return (
    <div className='flex items-center gap-2 px-4 py-3 border-b bg-card/50'>
      <Button size='sm' disabled>
        <UserPlus className='h-4 w-4 mr-2' />
        Пригласить
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm'>
            <Filter className='h-4 w-4 mr-2' />
            Фильтры
            {activeFilter !== undefined && (
              <Badge variant='secondary' className='ml-1.5 px-1 py-0 text-xs'>
                1
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => onFilterChange(undefined)}>
            <Users className='h-4 w-4 mr-2' />
            Все пользователи
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange(true)}>
            <CheckCircle className='h-4 w-4 mr-2' />
            Только активные
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange(false)}>
            <XCircle className='h-4 w-4 mr-2' />
            Только неактивные
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className='flex-1' />

      <div className='relative w-64'>
        <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Поиск по имени или email...'
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className='pl-8 h-8 text-sm'
        />
      </div>
    </div>
  );
}

export function UsersList({
  searchQuery: externalSearch,
  onSelectUser,
}: {
  searchQuery: string;
  onSelectUser: (userId: string, userName: string) => void;
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
    undefined
  );
  const [editUser, setEditUser] = useState<UserBrief | null>(null);
  const [deactivateUser, setDeactivateUser] = useState<UserBrief | null>(null);

  const combinedSearch = externalSearch || localSearch;

  const { data: usersResult, isLoading: usersLoading } = useAdminUsers({
    search: combinedSearch || undefined,
    isActive: activeFilter,
  });

  const { data: stats, isLoading: statsLoading } = useAdminUserStats();

  const updateUser = useUpdateUser();

  const users = usersResult?.data ?? [];

  const handleActivate = (user: UserBrief) => {
    updateUser.mutate(
      { userId: user.id, data: { is_active: true } },
      {
        onSuccess: () => toast.success(`Пользователь ${user.name} активирован`),
        onError: err =>
          toast.error(
            `Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`
          ),
      }
    );
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Заголовок + компактная статистика */}
      <div className='flex-shrink-0 px-4 py-4'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h2 className='text-xl font-semibold tracking-tight'>
              Список пользователей
            </h2>
            <p className='text-sm text-muted-foreground'>
              Управление всеми пользователями системы
            </p>
          </div>
          <StatsBar
            total={stats?.total ?? 0}
            active={stats?.active ?? 0}
            inactive={stats?.inactive ?? 0}
            totalArticles={stats?.totalArticles ?? 0}
            isLoading={statsLoading}
          />
        </div>
      </div>

      {/* Закреплённая панель фильтров */}
      <div className='flex-shrink-0'>
        <FilterBar
          searchQuery={localSearch}
          onSearchChange={setLocalSearch}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Скроллируемый список */}
      <div className='flex-1 overflow-y-auto min-h-0'>
        {usersLoading ? (
          <LoadingSpinner
            label='Загрузка пользователей...'
            className='py-12'
            size='size-5'
          />
        ) : users.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
            <Users className='size-10 mb-3 opacity-40' />
            <p className='text-sm'>
              {combinedSearch ? 'Пользователи не найдены' : 'Нет пользователей'}
            </p>
          </div>
        ) : (
          <div>
            {users.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={setEditUser}
                onDeactivate={setDeactivateUser}
                onActivate={handleActivate}
                onClick={onSelectUser}
              />
            ))}
          </div>
        )}
      </div>

      {/* Диалоги */}
      <EditUserDialog
        open={editUser !== null}
        user={editUser}
        onClose={() => setEditUser(null)}
      />
      <DeactivateUserDialog
        open={deactivateUser !== null}
        user={deactivateUser}
        onClose={() => setDeactivateUser(null)}
      />
    </div>
  );
}
