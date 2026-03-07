import { cn } from '@/app/components/ui/utils';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Hash, Pencil, Link2 } from 'lucide-react';

import type { Tag } from './tags.types';

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
                <p className='text-sm font-medium mt-1'>
                  {tag.category || '—'}
                </p>
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
                  {tag.createdAt.toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>

            <div className='p-3 border rounded-lg bg-muted/30'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
                <Link2 className='h-4 w-4' />
                Часто используется с:
              </div>
              <div className='flex flex-wrap gap-1.5'>
                <Badge variant='outline' className='text-xs'>
                  React
                </Badge>
                <Badge variant='outline' className='text-xs'>
                  TypeScript
                </Badge>
                <Badge variant='outline' className='text-xs'>
                  UI/UX
                </Badge>
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
