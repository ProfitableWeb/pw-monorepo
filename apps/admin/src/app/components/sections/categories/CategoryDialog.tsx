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
import { COLORS } from './categories.constants';
import type { Category, CategoryFormData } from './categories.types';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editingCategory: Category | null;
  formData: CategoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormData>>;
  rootCategories: Category[];
}

export function CategoryDialog({
  open,
  onClose,
  onSave,
  editingCategory,
  formData,
  setFormData,
  rootCategories,
}: CategoryDialogProps) {
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
              onChange={e => {
                const name = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  name,
                  slug: prev.slug || name.toLowerCase().replace(/\s+/g, '-'),
                }));
              }}
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
              placeholder='web-development'
            />
          </div>

          <div className='space-y-2'>
            <Label>Цвет</Label>
            <div className='flex gap-2 flex-wrap'>
              {COLORS.map(color => (
                <button
                  key={color.value}
                  onClick={() =>
                    setFormData(prev => ({ ...prev, color: color.value }))
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
            <Label htmlFor='parent'>Родительская категория</Label>
            <select
              id='parent'
              value={formData.parentId || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  parentId: e.target.value || null,
                }))
              }
              className='w-full p-2 border rounded-lg bg-background'
            >
              <option value=''>Без родителя (корневая)</option>
              {rootCategories
                .filter(c => c.id !== editingCategory?.id)
                .map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={onSave} disabled={!formData.name || !formData.slug}>
            {editingCategory ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
