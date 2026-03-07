import { useState } from 'react';
import {
  Plus,
  FileText,
  MessageSquare,
  CheckSquare,
  Workflow,
} from 'lucide-react';
import { IconButton } from '@/app/components/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { ScrollArea } from '@/app/components/ui/scroll-area';

export function CreateMenuPopover() {
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  const handleCreateAction = (action: string) => {
    setCreateMenuOpen(false);
    console.log(`Create action: ${action}`);
    // TODO: Implement actual action handlers
  };

  return (
    <Popover open={createMenuOpen} onOpenChange={setCreateMenuOpen}>
      <PopoverTrigger asChild>
        <IconButton>
          <Plus className='h-5 w-5' />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='end' sideOffset={8}>
        <div className='flex flex-col'>
          <div className='px-4 py-3 border-b'>
            <h3 className='font-semibold text-sm'>Создать</h3>
          </div>

          <ScrollArea className='max-h-[500px]'>
            <div className='p-2'>
              <button
                className='w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group'
                onClick={() => handleCreateAction('article')}
              >
                <div className='flex gap-3'>
                  <div className='flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                    <FileText className='h-4 w-4 text-primary' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium'>Статью</p>
                  </div>
                </div>
              </button>

              <button
                className='w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group'
                onClick={() => handleCreateAction('dialog')}
              >
                <div className='flex gap-3'>
                  <div className='flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                    <MessageSquare className='h-4 w-4 text-primary' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium'>Диалог</p>
                  </div>
                </div>
              </button>

              <button
                className='w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group'
                onClick={() => handleCreateAction('task')}
              >
                <div className='flex gap-3'>
                  <div className='flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                    <CheckSquare className='h-4 w-4 text-primary' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium'>Задачу</p>
                  </div>
                </div>
              </button>

              <button
                className='w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group'
                onClick={() => handleCreateAction('process')}
              >
                <div className='flex gap-3'>
                  <div className='flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                    <Workflow className='h-4 w-4 text-primary' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium'>Процесс</p>
                  </div>
                </div>
              </button>
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
