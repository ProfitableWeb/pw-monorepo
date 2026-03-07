import { Bot } from 'lucide-react';

export function StreamingIndicator() {
  return (
    <div className='flex gap-4'>
      <div className='flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
        <Bot className='h-5 w-5 text-primary' />
      </div>
      <div className='flex items-center gap-1 p-4 rounded-lg bg-muted/50 border'>
        <div
          className='w-2 h-2 rounded-full bg-muted-foreground animate-bounce'
          style={{ animationDelay: '0ms' }}
        />
        <div
          className='w-2 h-2 rounded-full bg-muted-foreground animate-bounce'
          style={{ animationDelay: '150ms' }}
        />
        <div
          className='w-2 h-2 rounded-full bg-muted-foreground animate-bounce'
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}
