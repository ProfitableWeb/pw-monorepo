import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { roleLabels } from '../users.constants';
import { useUpdateUser } from '../useAdminUsers';
import type { UserBrief } from '../users.types';

interface EditUserDialogProps {
  open: boolean;
  user: UserBrief | null;
  onClose: () => void;
}

export function EditUserDialog({ open, user, onClose }: EditUserDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserBrief['role']>('viewer');

  const updateUser = useUpdateUser();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;

    const data: { name?: string; email?: string; role?: string } = {};
    if (name !== user.name) data.name = name;
    if (email !== user.email) data.email = email;
    if (role !== user.role) data.role = role;

    if (Object.keys(data).length === 0) {
      onClose();
      return;
    }

    updateUser.mutate(
      { userId: user.id, data },
      {
        onSuccess: () => {
          toast.success('Пользователь обновлён');
          onClose();
        },
        onError: err => {
          toast.error(
            `Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`
          );
        },
      }
    );
  };

  const hasChanges =
    user && (name !== user.name || email !== user.email || role !== user.role);
  const isValid = name.trim().length > 0 && email.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle>Редактировать пользователя</DialogTitle>
          <DialogDescription>
            Изменение данных пользователя {user?.name}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='edit-name'>Имя</Label>
            <Input
              id='edit-name'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Имя пользователя'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='edit-email'>Email</Label>
            <Input
              id='edit-email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='email@example.com'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='edit-role'>Роль</Label>
            <Select
              value={role}
              onValueChange={v => setRole(v as UserBrief['role'])}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.entries(roleLabels) as [UserBrief['role'], string][]
                ).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={updateUser.isPending}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || !isValid || updateUser.isPending}
          >
            {updateUser.isPending && (
              <Loader2 className='size-4 mr-2 animate-spin' />
            )}
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
