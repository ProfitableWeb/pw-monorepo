import { cn } from '@/app/components/ui/utils';
import { Badge } from '@/app/components/ui/badge';
import { Code2 } from 'lucide-react';
import type { MessageVariant } from '@/app/store/ai-store';

interface ToolCallsBlockProps {
  toolCalls: NonNullable<MessageVariant['toolCalls']>;
}

export function ToolCallsBlock({ toolCalls }: ToolCallsBlockProps) {
  return (
    <div className='space-y-2'>
      {toolCalls.map(tool => (
        <details key={tool.id} className='group'>
          <summary className='cursor-pointer p-3 rounded-lg border text-sm flex items-center gap-2 hover:bg-muted/30 transition-colors'>
            <Code2 className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>{tool.name}</span>
            <Badge
              variant={
                tool.status === 'success'
                  ? 'outline'
                  : tool.status === 'error'
                    ? 'destructive'
                    : 'secondary'
              }
              className={cn(
                'text-xs ml-auto',
                tool.status === 'success' &&
                  'border-[rgb(200,225,210)] text-[rgb(90,170,120)] dark:border-[rgb(16,52,27)] dark:text-[rgb(65,145,94)]'
              )}
            >
              {tool.status === 'success' ? 'Success' : tool.status}
            </Badge>
            {tool.duration && (
              <span className='text-xs text-muted-foreground'>
                {tool.duration}ms
              </span>
            )}
          </summary>
          <div className='mt-2 p-3 rounded-lg border space-y-2'>
            <div>
              <p className='text-xs font-medium text-muted-foreground mb-1'>
                Input:
              </p>
              <pre className='text-xs bg-muted/30 p-2 rounded overflow-x-auto'>
                {JSON.stringify(tool.input, null, 2)}
              </pre>
            </div>
            {tool.output && (
              <div>
                <p className='text-xs font-medium text-muted-foreground mb-1'>
                  Output:
                </p>
                <p className='text-xs bg-muted/30 p-2 rounded'>{tool.output}</p>
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
