import { useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSetUserPassword } from '../useAdminUsers';

interface ChangePasswordDialogProps {
  open: boolean;
  userId: string;
  userName: string;
  onClose: () => void;
}

export function ChangePasswordDialog({
  open,
  userId,
  userName,
  onClose,
}: ChangePasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const setUserPassword = useSetUserPassword();

  const handleSave = () => {
    if (password.length < 6) {
      toast.error('Пароль должен содержать не менее 6 символов');
      return;
    }
    if (password !== confirm) {
      toast.error('Пароли не совпадают');
      return;
    }

    setUserPassword.mutate(
      { userId, newPassword: password },
      {
        onSuccess: () => {
          toast.success('Пароль установлен');
          setPassword('');
          setConfirm('');
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

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setPassword('');
      setConfirm('');
      onClose();
    }
  };

  const isValid = password.length >= 6 && password === confirm;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>Изменить пароль</DialogTitle>
          <DialogDescription>
            Установка нового пароля для пользователя {userName}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='new-password'>Новый пароль</Label>
            <Input
              id='new-password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='Минимум 6 символов'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirm-password'>Подтвердите пароль</Label>
            <Input
              id='confirm-password'
              type='password'
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder='Повторите пароль'
            />
            {confirm.length > 0 && password !== confirm && (
              <p className='text-xs text-destructive'>Пароли не совпадают</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => handleOpenChange(false)}
            disabled={setUserPassword.isPending}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid || setUserPassword.isPending}
          >
            {setUserPassword.isPending && (
              <Loader2 className='size-4 mr-2 animate-spin' />
            )}
            Установить пароль
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
