import { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';
import { Separator } from '@/app/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  ArrowLeft,
  Mail,
  Clock,
  Calendar,
  Key,
  Link2,
  Loader2,
  Power,
  CheckCircle,
  XCircle,
  Trash2,
  Camera,
  X,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { formatDate, LoadingSpinner } from '@/app/components/common';
import { toast } from 'sonner';
import {
  roleLabels,
  roleIcons,
  roleColors,
  statusLabels,
  statusColors,
} from '../users.constants';
import { getInitials } from '../users.utils';
import {
  useAdminUserDetail,
  useUpdateUser,
  useUploadUserAvatar,
  useDeleteUserAvatar,
} from '../useAdminUsers';
import { DeactivateUserDialog } from './DeactivateUserDialog';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import type { UserBrief, UserStatus } from '../users.types';

/** Карточка-секция внутри профиля */
function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='rounded-lg border bg-card p-5'>
      <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4'>
        {title}
      </h3>
      {children}
    </div>
  );
}

/** Строка key-value (для read-only данных) */
function InfoRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof Mail;
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3 py-2', className)}>
      <Icon className='size-4 text-muted-foreground flex-shrink-0' />
      <span className='text-sm text-muted-foreground w-32 flex-shrink-0'>
        {label}
      </span>
      <span className='text-sm font-medium'>{value}</span>
    </div>
  );
}

interface UserProfileProps {
  userId: string;
  onBack: () => void;
}

export function UserProfile({ userId, onBack }: UserProfileProps) {
  const { data: user, isLoading, error } = useAdminUserDetail(userId);
  const updateUser = useUpdateUser();
  const uploadAvatar = useUploadUserAvatar();
  const deleteAvatar = useDeleteUserAvatar();
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Форма редактирования
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserBrief['role']>('viewer');

  // Синхронизация формы с данными сервера
  useEffect(() => {
    if (user) {
      setFormName(user.name);
      setFormEmail(user.email);
      setFormRole(user.role as UserBrief['role']);
    }
  }, [user]);

  if (isLoading) {
    return (
      <LoadingSpinner
        label='Загрузка профиля...'
        className='h-full'
        size='size-5'
      />
    );
  }

  if (error || !user) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-muted-foreground gap-3'>
        <p className='text-sm'>Не удалось загрузить профиль пользователя</p>
        <Button variant='outline' size='sm' onClick={onBack}>
          <ArrowLeft className='size-4 mr-2' />
          Назад к списку
        </Button>
      </div>
    );
  }

  const role = user.role as UserBrief['role'];
  const RoleIcon = roleIcons[role];
  const status: UserStatus = user.isActive ? 'active' : 'inactive';

  const userAsBrief: UserBrief = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    avatar: user.avatar,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    articlesCount: user.articlesCount,
  };

  const hasChanges =
    formName.trim() !== user.name ||
    formEmail.trim() !== user.email ||
    formRole !== role;

  const isValid = formName.trim().length > 0 && formEmail.trim().length > 0;

  const handleSave = () => {
    const data: { name?: string; email?: string; role?: string } = {};
    if (formName.trim() !== user.name) data.name = formName.trim();
    if (formEmail.trim() !== user.email) data.email = formEmail.trim();
    if (formRole !== role) data.role = formRole;

    updateUser.mutate(
      { userId: user.id, data },
      {
        onSuccess: () => toast.success('Изменения сохранены'),
        onError: err =>
          toast.error(
            `Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`
          ),
      }
    );
  };

  const handleReset = () => {
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(role);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadAvatar.mutate(
      { userId: user.id, file },
      {
        onSuccess: () => toast.success('Аватар обновлён'),
        onError: err =>
          toast.error(
            `Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`
          ),
      }
    );

    // Сброс input, чтобы можно было загрузить тот же файл повторно
    e.target.value = '';
  };

  const handleAvatarDelete = () => {
    deleteAvatar.mutate(user.id, {
      onSuccess: () => toast.success('Аватар удалён'),
      onError: err =>
        toast.error(
          `Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`
        ),
    });
  };

  const handleActivate = () => {
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

  const avatarLoading = uploadAvatar.isPending || deleteAvatar.isPending;

  return (
    <div className='flex flex-col h-full'>
      {/* Шапка */}
      <div className='flex-shrink-0 px-6 py-4 flex items-center gap-4'>
        <Button variant='ghost' size='sm' onClick={onBack}>
          <ArrowLeft className='size-4 mr-2' />
          Назад
        </Button>
        <Separator orientation='vertical' className='h-6' />
        <h2 className='text-lg font-semibold'>Профиль пользователя</h2>
      </div>

      {/* Контент — скроллируемый */}
      <div className='flex-1 overflow-y-auto min-h-0 p-6'>
        <div className='max-w-4xl mx-auto space-y-6'>
          {/* Героическая секция с аватаром */}
          <div className='flex items-center gap-6'>
            <div className='relative group'>
              <Avatar className='size-20'>
                {user.avatar && (
                  <AvatarImage src={user.avatar} alt={user.name} />
                )}
                <AvatarFallback className='text-2xl font-semibold'>
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              {avatarLoading ? (
                <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/40'>
                  <Loader2 className='size-5 text-white animate-spin' />
                </div>
              ) : (
                <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/40 transition-colors'>
                  <button
                    className='opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className='size-4 text-gray-700' />
                  </button>
                  {user.avatar && (
                    <button
                      className='opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-white/90 hover:bg-white shadow-sm ml-1'
                      onClick={handleAvatarDelete}
                    >
                      <X className='size-3.5 text-destructive' />
                    </button>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type='file'
                accept='image/jpeg,image/png,image/gif,image/webp'
                className='hidden'
                onChange={handleAvatarUpload}
              />
            </div>

            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-1'>
                <h1 className='text-2xl font-bold'>{user.name}</h1>
                <Badge
                  variant='outline'
                  className={cn('text-sm py-0.5', roleColors[role])}
                >
                  <RoleIcon className='size-3.5 mr-1.5' />
                  {roleLabels[role]}
                </Badge>
                <Badge
                  variant='outline'
                  className={cn('text-sm py-0.5', statusColors[status])}
                >
                  {user.isActive ? (
                    <CheckCircle className='size-3.5 mr-1.5' />
                  ) : (
                    <XCircle className='size-3.5 mr-1.5' />
                  )}
                  {statusLabels[status]}
                </Badge>
              </div>
              <p className='text-muted-foreground'>{user.email}</p>
            </div>
          </div>

          {/* Основная информация — форма */}
          <InfoSection title='Основная информация'>
            <div className='space-y-4'>
              <div className='grid grid-cols-[120px_1fr] items-center gap-3'>
                <Label
                  htmlFor='profile-name'
                  className='text-sm text-muted-foreground'
                >
                  Имя
                </Label>
                <Input
                  id='profile-name'
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className='max-w-sm'
                />
              </div>

              <div className='grid grid-cols-[120px_1fr] items-center gap-3'>
                <Label
                  htmlFor='profile-email'
                  className='text-sm text-muted-foreground'
                >
                  Email
                </Label>
                <Input
                  id='profile-email'
                  type='email'
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  className='max-w-sm'
                />
              </div>

              <div className='grid grid-cols-[120px_1fr] items-center gap-3'>
                <Label className='text-sm text-muted-foreground'>Роль</Label>
                <Select
                  value={formRole}
                  onValueChange={v => setFormRole(v as UserBrief['role'])}
                >
                  <SelectTrigger className='max-w-sm'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.entries(roleLabels) as [
                        UserBrief['role'],
                        string,
                      ][]
                    ).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='grid grid-cols-[120px_1fr] items-center gap-3'>
                <span className='text-sm text-muted-foreground'>Статей</span>
                <span className='text-sm'>
                  {user.articlesCount > 0
                    ? `${user.articlesCount} статей`
                    : 'Нет статей'}
                </span>
              </div>

              {hasChanges && (
                <div className='flex items-center gap-2 pt-2'>
                  <Button
                    size='sm'
                    onClick={handleSave}
                    disabled={!isValid || updateUser.isPending}
                  >
                    {updateUser.isPending && (
                      <Loader2 className='size-4 mr-2 animate-spin' />
                    )}
                    Сохранить
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleReset}
                    disabled={updateUser.isPending}
                  >
                    Отменить
                  </Button>
                </div>
              )}
            </div>
          </InfoSection>

          {/* Безопасность и доступ */}
          <InfoSection title='Безопасность и доступ'>
            <div className='flex items-center gap-3 py-2'>
              <Key className='size-4 text-muted-foreground flex-shrink-0' />
              <span className='text-sm text-muted-foreground w-32 flex-shrink-0'>
                Пароль
              </span>
              <div className='flex items-center gap-3'>
                <Badge
                  variant='outline'
                  className={
                    user.hasPassword ? 'text-green-600' : 'text-amber-600'
                  }
                >
                  {user.hasPassword ? 'Установлен' : 'Не установлен'}
                </Badge>
                <Badge
                  variant='outline'
                  className='cursor-pointer hover:bg-accent transition-colors'
                  onClick={() => setPasswordOpen(true)}
                >
                  {user.hasPassword ? 'Сменить пароль' : 'Установить пароль'}
                </Badge>
              </div>
            </div>
            <InfoRow
              icon={Link2}
              label='OAuth'
              value={
                user.oauthProviders.length > 0 ? (
                  user.oauthProviders.map((p: string) => (
                    <Badge key={p} variant='secondary' className='mr-1.5'>
                      {p}
                    </Badge>
                  ))
                ) : (
                  <span className='text-muted-foreground'>Не подключено</span>
                )
              }
            />
          </InfoSection>

          {/* Хронология */}
          <InfoSection title='Хронология'>
            <InfoRow
              icon={Calendar}
              label='Регистрация'
              value={formatDate(user.createdAt, 'datetime')}
            />
            <InfoRow
              icon={Clock}
              label='Последний вход'
              value={formatDate(user.lastLoginAt, 'datetime', 'Не заходил')}
            />
            <InfoRow
              icon={Clock}
              label='Обновлено'
              value={formatDate(user.updatedAt, 'datetime')}
            />
          </InfoSection>

          {/* Лог активности — заглушка */}
          <InfoSection title='Последняя активность'>
            <div className='text-sm text-muted-foreground py-4 text-center'>
              Лог активности будет доступен в следующей версии
            </div>
          </InfoSection>

          {/* Опасная зона */}
          <div className='rounded-lg border border-destructive/20 bg-destructive/5 p-5'>
            <h3 className='text-sm font-semibold text-destructive mb-2'>
              Опасная зона
            </h3>
            <p className='text-sm text-muted-foreground mb-4'>
              {user.isActive
                ? 'Деактивация лишит пользователя доступа к системе. Это действие можно отменить.'
                : 'Пользователь деактивирован и не имеет доступа к системе.'}
            </p>
            {user.isActive ? (
              <Button
                variant='outline'
                size='sm'
                className='text-destructive border-destructive/30 hover:bg-destructive/10'
                onClick={() => setDeactivateOpen(true)}
              >
                <Trash2 className='size-4 mr-2' />
                Деактивировать пользователя
              </Button>
            ) : (
              <Button
                variant='outline'
                size='sm'
                className='text-green-600 border-green-600/30 hover:bg-green-600/10'
                onClick={handleActivate}
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? (
                  <Loader2 className='size-4 mr-2 animate-spin' />
                ) : (
                  <Power className='size-4 mr-2' />
                )}
                Активировать пользователя
              </Button>
            )}
          </div>
        </div>
      </div>

      <DeactivateUserDialog
        open={deactivateOpen}
        user={deactivateOpen ? userAsBrief : null}
        onClose={() => setDeactivateOpen(false)}
      />

      <ChangePasswordDialog
        open={passwordOpen}
        userId={user.id}
        userName={user.name}
        onClose={() => setPasswordOpen(false)}
      />
    </div>
  );
}
