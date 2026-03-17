import { cn } from '@/app/components/ui/utils';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Loader2 } from 'lucide-react';
import { COLORS } from '@/app/components/common/colors';

import type { Tag, TagFormData } from '../tags.types';
import { TAG_GROUPS } from '../tags.constants';

interface TagFormDialogProps {
  open: boolean;
  editingTag: Tag | null;
  formData: TagFormData;
  isSaving?: boolean;
  onFormChange: (data: TagFormData) => void;
  onSave: () => void;
  onClose: () => void;
}

export function TagFormDialog({
  open,
  editingTag,
  formData,
  isSaving,
  onFormChange,
  onSave,
  onClose,
}: TagFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {editingTag ? 'Редактировать метку' : 'Новая метка'}
          </DialogTitle>
          <DialogDescription>
            {editingTag
              ? 'Измените данные метки'
              : 'Создайте новую метку для организации контента'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Название</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={e =>
                onFormChange({ ...formData, name: e.target.value })
              }
              placeholder='Например: React'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='slug'>URL (slug)</Label>
            <Input
              id='slug'
              value={formData.slug}
              onChange={e =>
                onFormChange({ ...formData, slug: e.target.value })
              }
              placeholder='Авто из названия если пусто'
            />
          </div>

          <div className='space-y-2'>
            <Label>Цвет</Label>
            <div className='flex gap-2 flex-wrap'>
              {COLORS.map(color => (
                <button
                  key={color.tw}
                  onClick={() => onFormChange({ ...formData, color: color.tw })}
                  className={cn(
                    'w-10 h-10 rounded-lg transition-all',
                    color.tw,
                    formData.color === color.tw &&
                      'ring-2 ring-offset-2 ring-foreground scale-110'
                  )}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='group'>Группа</Label>
            <Select
              value={formData.group}
              onValueChange={value =>
                onFormChange({ ...formData, group: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Выберите группу' />
              </SelectTrigger>
              <SelectContent>
                {TAG_GROUPS.map(group => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isSaving}>
            Отмена
          </Button>
          <Button onClick={onSave} disabled={!formData.name || isSaving}>
            {isSaving && <Loader2 className='size-4 mr-2 animate-spin' />}
            {editingTag ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
