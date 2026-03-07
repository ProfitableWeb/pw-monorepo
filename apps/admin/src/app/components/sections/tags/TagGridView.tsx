import { cn } from '@/app/components/ui/utils';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { MoreVertical, Trash2, Hash, Pencil } from 'lucide-react';

import type { Tag } from './tags.types';

interface TagGridViewProps {
  tags: Tag[];
  onSelect: (tag: Tag) => void;
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
}

export function TagGridView({
  tags,
  onSelect,
  onEdit,
  onDelete,
}: TagGridViewProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {tags.map(tag => (
        <div
          key={tag.id}
          className='group p-4 border rounded-lg bg-card hover:shadow-md transition-all cursor-pointer'
          onClick={() => onSelect(tag)}
        >
          <div className='flex items-start justify-between mb-2'>
            <div className={cn('p-2 rounded-lg', tag.color)}>
              <Hash className='h-4 w-4 text-white' />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 opacity-0 group-hover:opacity-100'
                >
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    onEdit(tag);
                  }}
                >
                  <Pencil className='h-4 w-4 mr-2' />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(tag.id);
                  }}
                  className='text-destructive'
                >
                  <Trash2 className='h-4 w-4 mr-2' />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h3 className='font-semibold mb-1'>{tag.name}</h3>
          <p className='text-xs text-muted-foreground mb-2'>/{tag.slug}</p>
          <div className='flex items-center justify-between'>
            <Badge variant='secondary' className='text-xs'>
              {tag.articlesCount} статей
            </Badge>
            {tag.category && (
              <span className='text-xs text-muted-foreground'>
                {tag.category}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
