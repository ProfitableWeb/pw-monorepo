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

import type { Tag, TagFormData } from '../tags.types';
import { COLORS, TAG_GROUPS } from '../tags.constants';

interface TagFormDialogProps {
  open: boolean;
  editingTag: Tag | null;
  formData: TagFormData;
  onFormChange: (data: TagFormData) => void;
  onSave: () => void;
  onClose: () => void;
}

export function TagFormDialog({
  open,
  editingTag,
  formData,
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
              onChange={e => {
                const name = e.target.value;
                onFormChange({
                  ...formData,
                  name,
                  slug:
                    formData.slug || name.toLowerCase().replace(/\s+/g, '-'),
                });
              }}
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
              placeholder='react'
            />
          </div>

          <div className='space-y-2'>
            <Label>Цвет</Label>
            <div className='flex gap-2 flex-wrap'>
              {COLORS.map(color => (
                <button
                  key={color.value}
                  onClick={() =>
                    onFormChange({ ...formData, color: color.value })
                  }
                  className={cn(
                    'w-10 h-10 rounded-lg transition-all',
                    color.value,
                    formData.color === color.value &&
                      'ring-2 ring-offset-2 ring-foreground scale-110'
                  )}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category'>Группа</Label>
            <Select
              value={formData.category}
              onValueChange={value =>
                onFormChange({ ...formData, category: value })
              }
            >
              <SelectTrigger className='w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring'>
                <SelectValue placeholder='Выберите группу'>
                  {formData.category}
                </SelectValue>
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
          <Button variant='outline' onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={onSave} disabled={!formData.name || !formData.slug}>
            {editingTag ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
