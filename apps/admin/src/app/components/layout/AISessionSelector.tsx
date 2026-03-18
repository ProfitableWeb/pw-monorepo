import { Plus, MessageSquare, Check } from 'lucide-react';
import { formatDate } from '@/app/components/common';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { useAIStore } from '@/app/store/ai-store';
import { cn } from '@/app/components/ui/utils';

export function AISessionSelector() {
  const sessions = useAIStore(state => state.sessions);
  const currentSessionId = useAIStore(state => state.currentSessionId);
  const switchSession = useAIStore(state => state.switchSession);
  const getMessages = useAIStore(state => state.getMessages);
  const createNewSession = useAIStore(state => state.createNewSession);
  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='gap-2 h-9 justify-start'>
          <MessageSquare className='h-4 w-4' />
          <span className='font-medium text-sm max-w-[200px] lg:max-w-[400px] truncate'>
            {currentSession?.title || 'Сочинение манифеста'}
          </span>
          <Badge variant='secondary' className='ml-1 h-5 px-1.5 text-xs'>
            {getMessages().length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-80'>
        {sessions.map(session => (
          <DropdownMenuItem
            key={session.id}
            onClick={() => switchSession(session.id)}
            className='flex items-start gap-3 p-3 cursor-pointer'
          >
            <MessageSquare
              className={cn(
                'h-4 w-4 mt-1 flex-shrink-0',
                session.id === currentSessionId && 'text-primary'
              )}
            />
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2'>
                <span
                  className={cn(
                    'font-medium text-sm',
                    session.id === currentSessionId && 'text-primary'
                  )}
                >
                  {session.title}
                </span>
                {session.id === currentSessionId && (
                  <Check className='h-3 w-3 text-primary flex-shrink-0' />
                )}
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                {session.messages.length} сообщений ·{' '}
                {formatDate(session.updatedAt, {
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-primary cursor-pointer'
          onClick={() => {
            createNewSession('Новая сессия');
          }}
        >
          <Plus className='h-4 w-4 mr-2' />
          Новая сессия
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
