import { useHeaderStore } from '@/app/store/header-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
} from '@/hooks/api';
import { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/app/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { SortableCategoryCard } from './assets/SortableCategoryCard';
import { DragOverlayCard } from './assets/DragOverlayCard';
import { CategoryDialog } from './assets/CategoryDialog';
import { useCategoryDnd } from './useCategoryDnd';
import { hexToTw, twToHex, fallbackColor } from './categories.constants';
import type { Category, CategoryFormData } from './categories.types';

const INITIAL_FORM_DATA: CategoryFormData = {
  name: '',
  slug: '',
  color: 'bg-gray-500',
  parentId: null,
};

export function CategoriesSection() {
  const { data: apiCategories, isLoading } = useAdminCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const reorderMutation = useReorderCategories();

  // Маппинг API → UI категории
  const categories: Category[] = (apiCategories ?? []).map((cat, i) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    color: cat.color ? hexToTw(cat.color) : fallbackColor(i),
    articlesCount: cat.articleCount,
    parentId: cat.parentId,
    order: cat.order,
  }));

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(INITIAL_FORM_DATA);

  // Стор заголовка для хлебных крошек
  const { setBreadcrumbs, reset } = useHeaderStore();

  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.categories());
    return () => reset();
  }, [setBreadcrumbs, reset]);

  const handleReorder = useCallback(
    (items: { id: string; parent_id: string | null; order: number }[]) => {
      reorderMutation.mutate(items, {
        onError: () => toast.error('Не удалось сохранить порядок'),
      });
    },
    [reorderMutation]
  );

  const {
    sensors,
    activeCategory,
    dropIndicator,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useCategoryDnd(categories, handleReorder);

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

  const handleSave = () => {
    const colorHex = twToHex(formData.color);

    if (editingCategory) {
      updateMutation.mutate(
        {
          id: editingCategory.id,
          data: {
            name: formData.name,
            slug: formData.slug || undefined,
            color: colorHex,
            parent_id: formData.parentId,
          },
        },
        {
          onSuccess: () => {
            toast.success('Категория обновлена');
            handleCloseDialog();
          },
          onError: err => toast.error(`Ошибка: ${err.message}`),
        }
      );
    } else {
      createMutation.mutate(
        {
          name: formData.name,
          slug: formData.slug || undefined,
          color: colorHex,
          parent_id: formData.parentId,
          order: formData.parentId
            ? getChildCategories(formData.parentId).length
            : rootCategories.length,
        },
        {
          onSuccess: () => {
            toast.success('Категория создана');
            handleCloseDialog();
          },
          onError: err => toast.error(`Ошибка: ${err.message}`),
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('Категория удалена'),
      onError: err => toast.error(`Ошибка: ${err.message}`),
    });
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
    setFormData(INITIAL_FORM_DATA);
  };

  const totalArticles = categories.reduce(
    (sum, cat) => sum + cat.articlesCount,
    0
  );

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

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
              {categories.length} категорий • {totalArticles} статей
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            disabled={isMutating}
          >
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
        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='size-6 animate-spin text-muted-foreground' />
          </div>
        ) : categories.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            Нет категорий. Создайте первую!
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

        <CategoryDialog
          open={isAddDialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSave}
          isSaving={isMutating}
          editingCategory={editingCategory}
          formData={formData}
          setFormData={setFormData}
          rootCategories={rootCategories}
        />
      </div>
    </DndContext>
  );
}
