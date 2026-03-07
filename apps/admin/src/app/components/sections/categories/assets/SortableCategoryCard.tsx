import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/app/components/ui/utils';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  GripVertical,
  FolderOpen,
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { CategoryCardProps } from '../categories.types';

/** Карточка категории с поддержкой drag-and-drop */
export function SortableCategoryCard({
  category,
  level,
  onEdit,
  onDelete,
  dropIndicator,
}: CategoryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: level * 32,
    marginTop:
      dropIndicator?.targetId === category.id &&
      dropIndicator.position === 'before'
        ? 32
        : 0,
    marginBottom:
      dropIndicator?.targetId === category.id &&
      dropIndicator.position === 'after'
        ? 32
        : 2,
  };

  const isOverTop =
    dropIndicator?.targetId === category.id &&
    dropIndicator.position === 'before';
  const isOverBottom =
    dropIndicator?.targetId === category.id &&
    dropIndicator.position === 'after';
  const isOverCenter =
    dropIndicator?.targetId === category.id &&
    dropIndicator.position === 'child';

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`category-${category.id}`}
      className={cn(
        'relative group transition-all duration-200',
        isDragging && 'opacity-50'
      )}
      {...attributes}
    >
      {/* Индикаторы места вставки */}
      {isOverTop && (
        <div className='absolute -top-4 left-0 right-0 h-0.5 bg-blue-500 z-10 shadow-lg shadow-blue-500/50' />
      )}
      {isOverCenter && level < 1 && (
        <>
          <div className='absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none z-10 bg-blue-500/5' />
          <div className='absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none z-10 animate-pulse' />
        </>
      )}
      {isOverBottom && (
        <div className='absolute -bottom-4 left-0 right-0 h-0.5 bg-blue-500 z-10 shadow-lg shadow-blue-500/50' />
      )}

      <div
        className={cn(
          'flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200',
          isOverCenter && level < 1 && 'bg-accent/50 scale-[0.98]',
          (isOverTop || isOverBottom) && 'scale-[0.98]'
        )}
      >
        {/* Ручка перетаскивания */}
        <div
          className='cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground'
          {...listeners}
        >
          <GripVertical className='h-5 w-5' />
        </div>

        {/* Индикатор иерархии */}
        {level > 0 && (
          <div className='flex items-center gap-2 text-muted-foreground'>
            <div className='w-6 h-px bg-border' />
          </div>
        )}

        {/* Иконка категории с цветом */}
        <div className={cn('p-2 rounded-lg', category.color)}>
          <FolderOpen className='h-4 w-4 text-white' />
        </div>

        {/* Информация о категории */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <h3 className='font-medium truncate'>{category.name}</h3>
            <Badge variant='secondary' className='text-xs'>
              <FileText className='h-3 w-3 mr-1' />
              {category.articlesCount}
            </Badge>
          </div>
          <p className='text-xs text-muted-foreground'>/{category.slug}</p>
        </div>

        {/* Действия */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='opacity-0 group-hover:opacity-100'
            >
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Pencil className='h-4 w-4 mr-2' />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(category.id)}
              className='text-destructive'
            >
              <Trash2 className='h-4 w-4 mr-2' />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
