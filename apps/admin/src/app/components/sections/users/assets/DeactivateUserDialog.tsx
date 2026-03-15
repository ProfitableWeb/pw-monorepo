import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteUser } from '../useAdminUsers';
import type { UserBrief } from '../users.types';

interface DeactivateUserDialogProps {
  open: boolean;
  user: UserBrief | null;
  onClose: () => void;
}

export function DeactivateUserDialog({
  open,
  user,
  onClose,
}: DeactivateUserDialogProps) {
  const deleteUser = useDeleteUser();

  const handleConfirm = () => {
    if (!user) return;

    deleteUser.mutate(user.id, {
      onSuccess: () => {
        toast.success(`Пользователь ${user.name} деактивирован`);
        onClose();
      },
      onError: err => {
        toast.error(
          `Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`
        );
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Деактивировать пользователя?</AlertDialogTitle>
          <AlertDialogDescription>
            Пользователь <strong>{user?.name}</strong> ({user?.email}) будет
            деактивирован и потеряет доступ к системе. Это действие можно
            отменить через редактирование.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUser.isPending}>
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            disabled={deleteUser.isPending}
          >
            {deleteUser.isPending && (
              <Loader2 className='size-4 mr-2 animate-spin' />
            )}
            Деактивировать
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
