import { useHeaderStore } from "@/app/store/header-store";
import { breadcrumbPresets } from "@/app/utils/breadcrumbs-helper";
import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { cn } from "@/app/components/ui/utils";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  GripVertical,
  FolderOpen,
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { Label } from "@/app/components/ui/label";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  articlesCount: number;
  parentId: string | null;
  order: number;
}

const COLORS = [
  { name: "Серый", value: "bg-gray-500" },
  { name: "Красный", value: "bg-red-500" },
  { name: "Оранжевый", value: "bg-orange-500" },
  { name: "Желтый", value: "bg-yellow-500" },
  { name: "Зеленый", value: "bg-green-500" },
  { name: "Синий", value: "bg-blue-500" },
  { name: "Фиолетовый", value: "bg-purple-500" },
  { name: "Розовый", value: "bg-pink-500" },
];

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Технологии",
    slug: "tech",
    color: "bg-blue-500",
    articlesCount: 45,
    parentId: null,
    order: 0,
  },
  {
    id: "2",
    name: "Веб-разработка",
    slug: "web-dev",
    color: "bg-green-500",
    articlesCount: 28,
    parentId: "1",
    order: 0,
  },
  {
    id: "3",
    name: "Мобильная разработка",
    slug: "mobile-dev",
    color: "bg-purple-500",
    articlesCount: 17,
    parentId: "1",
    order: 1,
  },
  {
    id: "4",
    name: "Дизайн",
    slug: "design",
    color: "bg-pink-500",
    articlesCount: 32,
    parentId: null,
    order: 1,
  },
  {
    id: "5",
    name: "UI/UX",
    slug: "ui-ux",
    color: "bg-orange-500",
    articlesCount: 24,
    parentId: "4",
    order: 0,
  },
  {
    id: "6",
    name: "Маркетинг",
    slug: "marketing",
    color: "bg-red-500",
    articlesCount: 19,
    parentId: null,
    order: 2,
  },
];

interface DragItem {
  id: string;
  type: string;
}

interface CategoryCardProps {
  category: Category;
  level: number;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onMove: (draggedId: string, targetId: string | null, position: "before" | "after" | "child") => void;
}

function CategoryCard({ category, level, onEdit, onDelete, onMove }: CategoryCardProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: "CATEGORY",
    item: { id: category.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOverTop, isOverBottom, isOverCenter }, drop] = useDrop<
    DragItem,
    void,
    { isOverTop: boolean; isOverBottom: boolean; isOverCenter: boolean }
  >(() => ({
    accept: "CATEGORY",
    drop: (item, monitor) => {
      if (item.id === category.id) return;
      
      const hoverBoundingRect = monitor.getClientOffset();
      if (!hoverBoundingRect) return;

      const dropZone = getDropZone(monitor);
      if (dropZone === "top") {
        onMove(item.id, category.id, "before");
      } else if (dropZone === "bottom") {
        onMove(item.id, category.id, "after");
      } else if (dropZone === "center") {
        onMove(item.id, category.id, "child");
      }
    },
    collect: (monitor) => {
      if (!monitor.isOver() || !monitor.canDrop()) {
        return { isOverTop: false, isOverBottom: false, isOverCenter: false };
      }

      const dropZone = getDropZone(monitor);
      return {
        isOverTop: dropZone === "top",
        isOverBottom: dropZone === "bottom",
        isOverCenter: dropZone === "center",
      };
    },
  }));

  const getDropZone = (monitor: any): "top" | "center" | "bottom" => {
    const hoverBoundingRect = (monitor.getClientOffset() as { y: number }) || { y: 0 };
    const targetElement = document.getElementById(`category-${category.id}`);
    
    if (!targetElement) return "center";
    
    const targetRect = targetElement.getBoundingClientRect();
    const hoverY = hoverBoundingRect.y - targetRect.top;
    const height = targetRect.height;

    if (hoverY < height * 0.25) return "top";
    if (hoverY > height * 0.75) return "bottom";
    return "center";
  };

  return (
    <div
      ref={(node) => {
        drag(node);
        drop(node);
        dragPreview(node);
      }}
      id={`category-${category.id}`}
      className={cn(
        "relative group transition-all duration-200",
        isDragging && "opacity-50"
      )}
      style={{ 
        marginLeft: level * 32,
        marginTop: isOverTop ? 32 : 0,
        marginBottom: isOverBottom ? 32 : 2
      }}
    >
      {/* Drop indicators */}
      {isOverTop && (
        <div className="absolute -top-4 left-0 right-0 h-0.5 bg-blue-500 z-10 shadow-lg shadow-blue-500/50" />
      )}
      {isOverCenter && level < 1 && (
        <>
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none z-10 bg-blue-500/5" />
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none z-10 animate-pulse" />
        </>
      )}
      {isOverBottom && (
        <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-blue-500 z-10 shadow-lg shadow-blue-500/50" />
      )}

      <div
        className={cn(
          "flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200",
          isOverCenter && level < 1 && "bg-accent/50 scale-[0.98]",
          (isOverTop || isOverBottom) && "scale-[0.98]"
        )}
      >
        {/* Drag Handle */}
        <div
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          ref={drag}
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Hierarchy indicator */}
        {level > 0 && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-6 h-px bg-border" />
          </div>
        )}

        {/* Category Icon with Color */}
        <div className={cn("p-2 rounded-lg", category.color)}>
          <FolderOpen className="h-4 w-4 text-white" />
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{category.name}</h3>
            <Badge variant="secondary" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              {category.articlesCount}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">/{category.slug}</p>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Pencil className="h-4 w-4 mr-2" />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(category.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    color: string;
    parentId: string | null;
  }>({
    name: "",
    slug: "",
    color: "bg-gray-500",
    parentId: null,
  });

  // Header store for breadcrumbs
  const { setBreadcrumbs, reset } = useHeaderStore();

  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.categories());

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const rootCategories = categories.filter((c) => c.parentId === null).sort((a, b) => a.order - b.order);

  const getChildCategories = (parentId: string) => {
    return categories.filter((c) => c.parentId === parentId).sort((a, b) => a.order - b.order);
  };

  const handleMove = (draggedId: string, targetId: string | null, position: "before" | "after" | "child") => {
    setCategories((prev) => {
      const newCategories = [...prev];
      const draggedIndex = newCategories.findIndex((c) => c.id === draggedId);
      const draggedItem = newCategories[draggedIndex];
      
      if (!draggedItem) return prev;
      
      if (position === "child") {
        // Make it a child of target
        const oldParentId = draggedItem.parentId;
        const childrenCount = newCategories.filter((c) => c.parentId === targetId && c.id !== draggedId).length;
        
        // Update dragged item
        const updatedCategories = newCategories.map((c) => {
          if (c.id === draggedId) {
            return { ...c, parentId: targetId, order: childrenCount };
          }
          // Reorder old siblings
          if (c.parentId === oldParentId && c.order > draggedItem.order) {
            return { ...c, order: c.order - 1 };
          }
          return c;
        });
        
        return updatedCategories;
      } else {
        const targetIndex = newCategories.findIndex((c) => c.id === targetId);
        const targetItem = newCategories[targetIndex];
        
        if (!targetItem) return prev;
        
        const oldParentId = draggedItem.parentId;
        const newParentId = targetItem.parentId;
        const targetOrder = targetItem.order;
        const newOrder = position === "before" ? targetOrder : targetOrder + 1;
        
        // Update all affected categories
        const updatedCategories = newCategories.map((c) => {
          if (c.id === draggedId) {
            return { ...c, parentId: newParentId, order: newOrder };
          }
          
          // If moving within same parent
          if (oldParentId === newParentId) {
            if (c.parentId === newParentId && c.id !== draggedId) {
              const oldOrder = draggedItem.order;
              if (oldOrder < newOrder) {
                // Moving down: shift items between old and new position
                if (c.order > oldOrder && c.order <= newOrder) {
                  return { ...c, order: c.order - 1 };
                }
              } else {
                // Moving up: shift items between new and old position
                if (c.order >= newOrder && c.order < oldOrder) {
                  return { ...c, order: c.order + 1 };
                }
              }
            }
          } else {
            // Moving to different parent
            // Reorder old siblings
            if (c.parentId === oldParentId && c.order > draggedItem.order) {
              return { ...c, order: c.order - 1 };
            }
            // Make space in new parent
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
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, ...formData }
            : c
        )
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
      setCategories((prev) => [...prev, newCategory]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    // Also delete children
    const childrenIds = categories.filter((c) => c.parentId === id).map((c) => c.id);
    setCategories((prev) => prev.filter((c) => c.id !== id && !childrenIds.includes(c.id)));
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
    setFormData({ name: "", slug: "", color: "bg-gray-500", parentId: null });
  };

  const totalArticles = categories.reduce((sum, cat) => sum + cat.articlesCount, 0);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Управление категориями статей
            </h1>
            <p className="text-muted-foreground mt-1">
              {categories.length} категорий • {totalArticles} статей • 0 тегов
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Новая категория
          </Button>
        </div>

        {/* Info Card */}
        <div className="p-4 border rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Подсказка:</strong> Перетаскивайте категории для изменения порядка.
            Перетащите на другую категорию, чтобы делать её подкатегорией (только один уровень вложенности).
          </p>
        </div>

        {/* Categories List */}
        <div className="space-y-1">
          {rootCategories.map((category) => (
            <div key={category.id}>
              <CategoryCard
                category={category}
                level={0}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMove={handleMove}
              />
              {/* Child categories */}
              {getChildCategories(category.id).map((child) => (
                <CategoryCard
                  key={child.id}
                  category={child}
                  level={1}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMove={handleMove}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Редактировать категорию" : "Новая категория"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Измените данные категории"
                  : "Создайте новую категорию для организации контента"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      slug: prev.slug || name.toLowerCase().replace(/\s+/g, "-"),
                    }));
                  }}
                  placeholder="Например: Веб-разработка"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL (slug)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="web-development"
                />
              </div>

              <div className="space-y-2">
                <Label>Цвет</Label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                      className={cn(
                        "w-10 h-10 rounded-lg transition-all",
                        color.value,
                        formData.color === color.value && "ring-2 ring-offset-2 ring-foreground scale-110"
                      )}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent">Родительская категория</Label>
                <select
                  id="parent"
                  value={formData.parentId || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      parentId: e.target.value || null,
                    }))
                  }
                  className="w-full p-2 border rounded-lg bg-background"
                >
                  <option value="">Без родителя (корневая)</option>
                  {rootCategories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Отмена
              </Button>
              <Button onClick={handleSave} disabled={!formData.name || !formData.slug}>
                {editingCategory ? "Сохранить" : "Создать"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
}