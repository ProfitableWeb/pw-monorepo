import { cn } from '@/app/components/ui/utils';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Hash, Pencil } from 'lucide-react';
import { formatDate } from '@/app/components/common';

import type { Tag } from '../tags.types';

interface TagDetailDialogProps {
  tag: Tag | null;
  onClose: () => void;
  onEdit: (tag: Tag) => void;
}

export function TagDetailDialog({
  tag,
  onClose,
  onEdit,
}: TagDetailDialogProps) {
  return (
    <Dialog open={tag !== null} onOpenChange={() => onClose()}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className={cn('p-2 rounded-lg', tag?.color)}>
              <Hash className='h-4 w-4 text-white' />
            </div>
            {tag?.name}
          </DialogTitle>
          <DialogDescription>Детальная информация о метке</DialogDescription>
        </DialogHeader>

        {tag && (
          <div className='space-y-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='text-xs text-muted-foreground'>Slug</Label>
                <p className='text-sm font-medium mt-1'>/{tag.slug}</p>
              </div>
              <div>
                <Label className='text-xs text-muted-foreground'>Группа</Label>
                <p className='text-sm font-medium mt-1'>{tag.group || '—'}</p>
              </div>
              <div>
                <Label className='text-xs text-muted-foreground'>
                  Использований
                </Label>
                <p className='text-sm font-medium mt-1'>
                  {tag.articlesCount} статей
                </p>
              </div>
              <div>
                <Label className='text-xs text-muted-foreground'>Создана</Label>
                <p className='text-sm font-medium mt-1'>
                  {formatDate(tag.createdAt)}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Закрыть
          </Button>
          <Button
            onClick={() => {
              onEdit(tag!);
              onClose();
            }}
          >
            <Pencil className='h-4 w-4 mr-2' />
            Редактировать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
