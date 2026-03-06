import { useRef, useState, useCallback, type ReactNode } from 'react';
import { cn } from '@/app/components/ui/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorkspaceLayoutStore } from '@/app/store/workspace-layout-store';

interface ResizableSidebarProps {
  position: 'left' | 'right';
  children: ReactNode;
  minWidth?: number;
  maxWidthPercent?: number;
}

export function ResizableSidebar({
  position,
  children,
  minWidth = 180,
  maxWidthPercent = 30,
}: ResizableSidebarProps) {
  const {
    leftSidebarWidth,
    leftSidebarCollapsed,
    rightSidebarWidth,
    rightSidebarCollapsed,
    setLeftSidebarWidth,
    setRightSidebarWidth,
    toggleLeftSidebar,
    toggleRightSidebar,
  } = useWorkspaceLayoutStore();

  const isLeft = position === 'left';
  const width = isLeft ? leftSidebarWidth : rightSidebarWidth;
  const collapsed = isLeft ? leftSidebarCollapsed : rightSidebarCollapsed;
  const setWidth = isLeft ? setLeftSidebarWidth : setRightSidebarWidth;
  const toggle = isLeft ? toggleLeftSidebar : toggleRightSidebar;

  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const getMaxWidth = useCallback(
    () => (window.innerWidth * maxWidthPercent) / 100,
    [maxWidthPercent]
  );

  const clamp = useCallback(
    (value: number) => Math.min(Math.max(value, minWidth), getMaxWidth()),
    [minWidth, getMaxWidth]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
      startX.current = e.clientX;
      startWidth.current = width;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    },
    [width]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const delta = isLeft
        ? e.clientX - startX.current
        : startX.current - e.clientX;
      setWidth(clamp(startWidth.current + delta));
    },
    [isDragging, isLeft, setWidth, clamp]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    },
    [isDragging]
  );

  const ToggleIcon = isLeft
    ? collapsed
      ? ChevronRight
      : ChevronLeft
    : collapsed
      ? ChevronLeft
      : ChevronRight;

  return (
    <div
      className={cn(
        'relative flex-shrink-0',
        !isDragging && 'transition-[width] duration-200',
        collapsed && 'w-0'
      )}
      style={collapsed ? undefined : { width }}
    >
      {/* Контент */}
      <div
        className={cn(
          'h-full overflow-hidden',
          isLeft ? 'border-r' : 'border-l',
          collapsed && 'invisible'
        )}
      >
        {children}
      </div>

      {/* Ручка перетаскивания */}
      {!collapsed && (
        <div
          className={cn(
            'absolute top-0 bottom-0 w-1 z-10 cursor-col-resize transition-colors',
            'hover:bg-primary/20 active:bg-primary/40',
            isLeft ? 'right-0' : 'left-0'
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      )}

      {/* Кнопка сворачивания */}
      <button
        onClick={toggle}
        className={cn(
          'absolute bottom-3 z-20 h-6 w-6 rounded-full border bg-background shadow-sm',
          'flex items-center justify-center hover:bg-accent transition-colors',
          isLeft
            ? collapsed
              ? 'left-1'
              : '-right-3'
            : collapsed
              ? 'right-1'
              : '-left-3'
        )}
      >
        <ToggleIcon className='h-3 w-3' />
      </button>
    </div>
  );
}
