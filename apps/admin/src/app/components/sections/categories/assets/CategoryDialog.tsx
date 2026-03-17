import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { cn } from '@/app/components/ui/utils';
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
import { COLORS, NO_PARENT_VALUE } from '../categories.constants';
import type { Category, CategoryFormData } from '../categories.types';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  isSaving?: boolean;
  editingCategory: Category | null;
  formData: CategoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormData>>;
  rootCategories: Category[];
}

export function CategoryDialog({
  open,
  onClose,
  onSave,
  isSaving,
  editingCategory,
  formData,
  setFormData,
  rootCategories,
}: CategoryDialogProps) {
  const availableParents = rootCategories.filter(
    c => c.id !== editingCategory?.id
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? 'Измените данные категории'
              : 'Создайте новую категорию для организации контента'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Название</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              placeholder='Например: Веб-разработка'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='slug'>URL (slug)</Label>
            <Input
              id='slug'
              value={formData.slug}
              onChange={e =>
                setFormData(prev => ({ ...prev, slug: e.target.value }))
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
                  onClick={() =>
                    setFormData(prev => ({ ...prev, color: color.tw }))
                  }
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
            <Label>Родительская категория</Label>
            <Select
              value={formData.parentId ?? NO_PARENT_VALUE}
              onValueChange={val =>
                setFormData(prev => ({
                  ...prev,
                  parentId: val === NO_PARENT_VALUE ? null : val,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Без родителя (корневая)' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PARENT_VALUE}>
                  Без родителя (корневая)
                </SelectItem>
                {availableParents.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
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
            {editingCategory ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
