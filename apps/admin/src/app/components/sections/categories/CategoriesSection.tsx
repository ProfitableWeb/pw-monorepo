import { useHeaderStore } from '@/app/store/header-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';
import { useCategories } from '@/hooks/api';
import { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { cn } from '@/app/components/ui/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Label } from '@/app/components/ui/label';

import { SortableCategoryCard } from './SortableCategoryCard';
import { DragOverlayCard } from './DragOverlayCard';
import { COLORS, FALLBACK_COLORS } from './categories.constants';
import type { Category, DropIndicator, DropPosition } from './categories.types';

export function CategoriesSection() {
  const { data: apiCategories, isLoading } = useCategories();
  const [categories, setCategories] = useState<Category[]>([]);
  const initialized = useRef(false);

  // Синхронизация данных API → локальное состояние (сохраняет порядок DnD)
  useEffect(() => {
    if (apiCategories && !initialized.current) {
      initialized.current = true;
      setCategories(
        apiCategories.map((cat, i) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          color: FALLBACK_COLORS[i % FALLBACK_COLORS.length],
          articlesCount: cat.articleCount,
          parentId: null,
          order: i,
        }))
      );
    }
  }, [apiCategories]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(
    null
  );
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    color: string;
    parentId: string | null;
  }>({
    name: '',
    slug: '',
    color: 'bg-gray-500',
    parentId: null,
  });

  // Стор заголовка для хлебных крошек
  const { setBreadcrumbs, reset } = useHeaderStore();

  // Установить хлебные крошки
  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.categories());

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const rootCategories = categories
    .filter(c => c.parentId === null)
    .sort((a, b) => a.order - b.order);

  const getChildCategories = (parentId: string) => {
    return categories
      .filter(c => c.parentId === parentId)
      .sort((a, b) => a.order - b.order);
  };

  // Плоский список ID категорий в порядке рендера (для SortableContext)
  const allItemIds = rootCategories.flatMap(cat => [
    cat.id,
    ...getChildCategories(cat.id).map(child => child.id),
  ]);

  const getDropPosition = (
    overId: string,
    event: DragOverEvent
  ): DropPosition => {
    const overElement = document.getElementById(`category-${overId}`);
    if (!overElement) return 'after';

    const rect = overElement.getBoundingClientRect();
    const activatorEvent = event.activatorEvent as PointerEvent | undefined;
    const overEvent = event.over;

    // Используем дельту перетаскивания для оценки позиции курсора
    if (overEvent?.rect) {
      const overRect = overEvent.rect;
      const pointerY = activatorEvent
        ? activatorEvent.clientY + (event.delta?.y ?? 0)
        : rect.top + rect.height / 2;

      const relativeY = pointerY - rect.top;
      const height = rect.height;

      if (relativeY < height * 0.25) return 'before';
      if (relativeY > height * 0.75) return 'after';
      return 'child';
    }

    return 'after';
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setDropIndicator(null);
      return;
    }

    const overId = over.id as string;
    const overCategory = categories.find(c => c.id === overId);

    if (!overCategory) {
      setDropIndicator(null);
      return;
    }

    const position = getDropPosition(overId, event);

    // Не допускать вложенность глубже 1 уровня
    if (position === 'child' && overCategory.parentId !== null) {
      setDropIndicator({ targetId: overId, position: 'after' });
      return;
    }

    setDropIndicator({ targetId: overId, position });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id || !dropIndicator) {
      setDropIndicator(null);
      return;
    }

    const draggedId = active.id as string;
    const targetId = dropIndicator.targetId;
    const position = dropIndicator.position;

    setDropIndicator(null);
    handleMove(draggedId, targetId, position);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDropIndicator(null);
  };

  const handleMove = (
    draggedId: string,
    targetId: string | null,
    position: DropPosition
  ) => {
    setCategories(prev => {
      const newCategories = [...prev];
      const draggedIndex = newCategories.findIndex(c => c.id === draggedId);
      const draggedItem = newCategories[draggedIndex];

      if (!draggedItem) return prev;

      if (position === 'child') {
        // Сделать дочерним элементом цели
        const oldParentId = draggedItem.parentId;
        const childrenCount = newCategories.filter(
          c => c.parentId === targetId && c.id !== draggedId
        ).length;

        // Обновить перетаскиваемый элемент
        const updatedCategories = newCategories.map(c => {
          if (c.id === draggedId) {
            return { ...c, parentId: targetId, order: childrenCount };
          }
          // Переупорядочить старых соседей
          if (c.parentId === oldParentId && c.order > draggedItem.order) {
            return { ...c, order: c.order - 1 };
          }
          return c;
        });

        return updatedCategories;
      } else {
        const targetIndex = newCategories.findIndex(c => c.id === targetId);
        const targetItem = newCategories[targetIndex];

        if (!targetItem) return prev;

        const oldParentId = draggedItem.parentId;
        const newParentId = targetItem.parentId;
        const targetOrder = targetItem.order;
        const newOrder = position === 'before' ? targetOrder : targetOrder + 1;

        // Обновить все затронутые категории
        const updatedCategories = newCategories.map(c => {
          if (c.id === draggedId) {
            return { ...c, parentId: newParentId, order: newOrder };
          }

          // Перемещение внутри одного родителя
          if (oldParentId === newParentId) {
            if (c.parentId === newParentId && c.id !== draggedId) {
              const oldOrder = draggedItem.order;
              if (oldOrder < newOrder) {
                // Вниз: сдвинуть элементы между старой и новой позицией
                if (c.order > oldOrder && c.order <= newOrder) {
                  return { ...c, order: c.order - 1 };
                }
              } else {
                // Вверх: сдвинуть элементы между новой и старой позицией
                if (c.order >= newOrder && c.order < oldOrder) {
                  return { ...c, order: c.order + 1 };
                }
              }
            }
          } else {
            // Перемещение к другому родителю
            // Переупорядочить старых соседей
            if (c.parentId === oldParentId && c.order > draggedItem.order) {
              return { ...c, order: c.order - 1 };
            }
            // Освободить место в новом родителе
            if (c.parentId === newParentId && c.order >= newOrder) {
              return { ...c, order: c.order + 1 };
            }
          }

          return c;
        });

        return updatedCategories;
      }
    });
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(prev =>
        prev.map(c => (c.id === editingCategory.id ? { ...c, ...formData } : c))
      );
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        slug: formData.slug,
        color: formData.color,
        articlesCount: 0,
        parentId: formData.parentId,
        order: formData.parentId
          ? getChildCategories(formData.parentId).length
          : rootCategories.length,
      };
      setCategories(prev => [...prev, newCategory]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    // Также удалить дочерние
    const childrenIds = categories
      .filter(c => c.parentId === id)
      .map(c => c.id);
    setCategories(prev =>
      prev.filter(c => c.id !== id && !childrenIds.includes(c.id))
    );
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      color: category.color,
      parentId: category.parentId,
    });
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', color: 'bg-gray-500', parentId: null });
  };

  const totalArticles = categories.reduce(
    (sum, cat) => sum + cat.articlesCount,
    0
  );
  const activeCategory = activeId
    ? categories.find(c => c.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className='p-6 space-y-6'>
        {/* Заголовок */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>
              Управление категориями статей
            </h1>
            <p className='text-muted-foreground mt-1'>
              {categories.length} категорий • {totalArticles} статей • 0 тегов
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className='h-4 w-4 mr-2' />
            Новая категория
          </Button>
        </div>

        {/* Информационная карточка */}
        <div className='p-4 border rounded-lg bg-muted/50'>
          <p className='text-sm text-muted-foreground'>
            💡 <strong>Подсказка:</strong> Перетаскивайте категории для
            изменения порядка. Перетащите на другую категорию, чтобы делать её
            подкатегорией (только один уровень вложенности).
          </p>
        </div>

        {/* Список категорий */}
        {isLoading && categories.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            Загрузка категорий...
          </div>
        ) : (
          <SortableContext
            items={allItemIds}
            strategy={verticalListSortingStrategy}
          >
            <div className='space-y-1'>
              {rootCategories.map(category => (
                <div key={category.id}>
                  <SortableCategoryCard
                    category={category}
                    level={0}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    dropIndicator={dropIndicator}
                  />
                  {/* Дочерние категории */}
                  {getChildCategories(category.id).map(child => (
                    <SortableCategoryCard
                      key={child.id}
                      category={child}
                      level={1}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      dropIndicator={dropIndicator}
                    />
                  ))}
                </div>
              ))}
            </div>
          </SortableContext>
        )}

        <DragOverlay>
          {activeCategory ? (
            <DragOverlayCard category={activeCategory} />
          ) : null}
        </DragOverlay>

        {/* Диалог создания/редактирования */}
        <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory
                  ? 'Редактировать категорию'
                  : 'Новая категория'}
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
                      slug:
                        prev.slug || name.toLowerCase().replace(/\s+/g, '-'),
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
              <Button variant='outline' onClick={handleCloseDialog}>
                Отмена
              </Button>
              <Button
                onClick={handleSave}
                disabled={!formData.name || !formData.slug}
              >
                {editingCategory ? 'Сохранить' : 'Создать'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndContext>
  );
}
