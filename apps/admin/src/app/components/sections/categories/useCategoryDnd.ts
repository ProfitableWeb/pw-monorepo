import { useState, useCallback } from 'react';
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import type { Category, DropIndicator, DropPosition } from './categories.types';

interface ReorderItem {
  id: string;
  parent_id: string | null;
  order: number;
}

/** Логика drag-and-drop для списка категорий */
export function useCategoryDnd(
  categories: Category[],
  onReorder: (items: ReorderItem[]) => void
) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const getDropPosition = (
    overId: string,
    event: DragOverEvent
  ): DropPosition => {
    const overElement = document.getElementById(`category-${overId}`);
    if (!overElement) return 'after';

    const rect = overElement.getBoundingClientRect();
    const activatorEvent = event.activatorEvent as PointerEvent | undefined;
    const overEvent = event.over;

    if (overEvent?.rect) {
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

  /** Вычисляет новый порядок после DnD и вызывает onReorder */
  const handleMove = useCallback(
    (draggedId: string, targetId: string | null, position: DropPosition) => {
      const newCategories = categories.map(c => ({
        ...c,
        parentId: c.parentId,
        order: c.order,
      }));
      const draggedItem = newCategories.find(c => c.id === draggedId);
      if (!draggedItem) return;

      if (position === 'child') {
        const oldParentId = draggedItem.parentId;
        const childrenCount = newCategories.filter(
          c => c.parentId === targetId && c.id !== draggedId
        ).length;

        draggedItem.parentId = targetId;
        draggedItem.order = childrenCount;

        // Пересчёт порядка у старых соседей
        newCategories
          .filter(c => c.parentId === oldParentId && c.id !== draggedId)
          .sort((a, b) => a.order - b.order)
          .forEach((c, i) => {
            c.order = i;
          });
      } else {
        const targetItem = newCategories.find(c => c.id === targetId);
        if (!targetItem) return;

        const oldParentId = draggedItem.parentId;
        const newParentId = targetItem.parentId;

        draggedItem.parentId = newParentId;

        // Пересчёт порядка у старых соседей (если сменился родитель)
        if (oldParentId !== newParentId) {
          newCategories
            .filter(c => c.parentId === oldParentId && c.id !== draggedId)
            .sort((a, b) => a.order - b.order)
            .forEach((c, i) => {
              c.order = i;
            });
        }

        // Вставка в нужную позицию среди новых соседей
        const siblings = newCategories
          .filter(c => c.parentId === newParentId && c.id !== draggedId)
          .sort((a, b) => a.order - b.order);

        const targetIdx = siblings.findIndex(c => c.id === targetId);
        const insertIdx = position === 'before' ? targetIdx : targetIdx + 1;

        siblings.splice(insertIdx, 0, draggedItem);
        siblings.forEach((c, i) => {
          c.order = i;
        });
      }

      // Отправляем полный массив {id, parent_id, order}
      onReorder(
        newCategories.map(c => ({
          id: c.id,
          parent_id: c.parentId,
          order: c.order,
        }))
      );
    },
    [categories, onReorder]
  );

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

  const activeCategory = activeId
    ? categories.find(c => c.id === activeId)
    : null;

  return {
    sensors,
    activeCategory,
    dropIndicator,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
