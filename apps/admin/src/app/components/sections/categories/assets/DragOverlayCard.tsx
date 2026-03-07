import { cn } from '@/app/components/ui/utils';
import { Badge } from '@/app/components/ui/badge';
import { GripVertical, FolderOpen, FileText } from 'lucide-react';
import type { Category } from '../categories.types';

/** Оверлей карточки при перетаскивании */
export function DragOverlayCard({ category }: { category: Category }) {
  return (
    <div className='flex items-center gap-3 p-4 rounded-lg border bg-card shadow-xl opacity-90 w-[400px]'>
      <div className='text-muted-foreground'>
        <GripVertical className='h-5 w-5' />
      </div>
      <div className={cn('p-2 rounded-lg', category.color)}>
        <FolderOpen className='h-4 w-4 text-white' />
      </div>
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
    </div>
  );
}
