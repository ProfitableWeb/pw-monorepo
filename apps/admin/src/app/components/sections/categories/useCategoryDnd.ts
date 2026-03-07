import { useState } from 'react';
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import type { Category, DropIndicator, DropPosition } from './categories.types';

/** Логика drag-and-drop для списка категорий */
export function useCategoryDnd(
  categories: Category[],
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
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

    // Используем дельту перетаскивания для оценки позиции курсора
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
