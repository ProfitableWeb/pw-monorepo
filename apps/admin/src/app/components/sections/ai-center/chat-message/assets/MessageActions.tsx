import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Copy, RotateCcw, Trash2, MoreVertical, Edit2 } from 'lucide-react';
import { copyToClipboard } from '../../ai-center.utils';

interface MessageActionsProps {
  role: 'user' | 'assistant';
  content: string;
  onEdit: () => void;
  onRegenerate: () => void;
}

export function MessageActions({
  role,
  content,
  onEdit,
  onRegenerate,
}: MessageActionsProps) {
  return (
    <div className='flex items-center gap-1'>
      <Button variant='ghost' size='icon' className='h-8 w-8' onClick={onEdit}>
        <Edit2 className='h-3 w-3' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        onClick={() => copyToClipboard(content)}
      >
        <Copy className='h-3 w-3' />
      </Button>
      {role === 'assistant' && (
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8'
          onClick={onRegenerate}
        >
          <RotateCcw className='h-3 w-3' />
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <MoreVertical className='h-3 w-3' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem>
            <Copy className='h-4 w-4 mr-2' />
            Копировать
          </DropdownMenuItem>
          <DropdownMenuItem className='text-destructive'>
            <Trash2 className='h-4 w-4 mr-2' />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
