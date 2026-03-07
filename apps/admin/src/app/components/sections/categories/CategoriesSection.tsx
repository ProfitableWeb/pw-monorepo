import { useHeaderStore } from '@/app/store/header-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';
import { useCategories } from '@/hooks/api';
import { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/app/components/ui/button';
import { Plus } from 'lucide-react';

import { SortableCategoryCard } from './assets/SortableCategoryCard';
import { DragOverlayCard } from './assets/DragOverlayCard';
import { CategoryDialog } from './assets/CategoryDialog';
import { useCategoryDnd } from './useCategoryDnd';
import { FALLBACK_COLORS } from './categories.constants';
import type { Category, CategoryFormData } from './categories.types';

const INITIAL_FORM_DATA: CategoryFormData = {
  name: '',
  slug: '',
  color: 'bg-gray-500',
  parentId: null,
};

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
          color: FALLBACK_COLORS[i % FALLBACK_COLORS.length] ?? 'bg-gray-500',
          articlesCount: cat.articleCount,
          parentId: null,
          order: i,
        }))
      );
    }
  }, [apiCategories]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(INITIAL_FORM_DATA);

  // Стор заголовка для хлебных крошек
  const { setBreadcrumbs, reset } = useHeaderStore();

  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.categories());
    return () => reset();
  }, [setBreadcrumbs, reset]);

  const {
    sensors,
    activeCategory,
    dropIndicator,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useCategoryDnd(categories, setCategories);

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
    setFormData(INITIAL_FORM_DATA);
  };

  const totalArticles = categories.reduce(
    (sum, cat) => sum + cat.articlesCount,
    0
  );

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
          editingCategory={editingCategory}
          formData={formData}
          setFormData={setFormData}
          rootCategories={rootCategories}
        />
      </div>
    </DndContext>
  );
}
