/** Типы для раздела категорий */

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  articlesCount: number;
  parentId: string | null;
  order: number;
  isDefault: boolean;
}

export type DropPosition = 'before' | 'after' | 'child';

export interface DropIndicator {
  targetId: string;
  position: DropPosition;
}

export interface CategoryCardProps {
  category: Category;
  level: number;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  dropIndicator: DropIndicator | null;
  isDragOverlay?: boolean;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  color: string;
  parentId: string | null;
}
