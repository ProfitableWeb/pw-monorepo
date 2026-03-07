import { cn } from '@/app/components/ui/utils';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { MoreVertical, Trash2, Pencil } from 'lucide-react';

import type { Tag } from '../tags.types';

interface TagListViewProps {
  tags: Tag[];
  onSelect: (tag: Tag) => void;
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
}

export function TagListView({
  tags,
  onSelect,
  onEdit,
  onDelete,
}: TagListViewProps) {
  return (
    <div className='border rounded-lg overflow-hidden'>
      <table className='w-full'>
        <thead className='bg-muted/50'>
          <tr className='text-sm'>
            <th className='text-left p-3 font-medium'>Метка</th>
            <th className='text-left p-3 font-medium'>Группа</th>
            <th className='text-left p-3 font-medium'>Статей</th>
            <th className='text-left p-3 font-medium'>Создана</th>
            <th className='text-right p-3 font-medium'>Действия</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag, index) => (
            <tr
              key={tag.id}
              className={cn(
                'border-t hover:bg-muted/30 transition-colors cursor-pointer',
                index % 2 === 0 && 'bg-muted/10'
              )}
              onClick={() => onSelect(tag)}
            >
              <td className='p-3'>
                <div className='flex items-center gap-2'>
                  <div className={cn('w-3 h-3 rounded-full', tag.color)} />
                  <div>
                    <div className='font-medium'>{tag.name}</div>
                    <div className='text-xs text-muted-foreground'>
                      /{tag.slug}
                    </div>
                  </div>
                </div>
              </td>
              <td className='p-3 text-sm text-muted-foreground'>
                {tag.category || '—'}
              </td>
              <td className='p-3'>
                <Badge variant='secondary' className='text-xs'>
                  {tag.articlesCount}
                </Badge>
              </td>
              <td className='p-3 text-sm text-muted-foreground'>
                {tag.createdAt.toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td className='p-3 text-right' onClick={e => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => onEdit(tag)}>
                      <Pencil className='h-4 w-4 mr-2' />
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(tag.id)}
                      className='text-destructive'
                    >
                      <Trash2 className='h-4 w-4 mr-2' />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
