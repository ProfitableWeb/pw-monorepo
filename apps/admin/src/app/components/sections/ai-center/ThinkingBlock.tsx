import { Brain } from 'lucide-react';
import type { MessageVariant } from '@/app/store/ai-store';

interface ThinkingBlockProps {
  thinking: NonNullable<MessageVariant['thinking']>;
}

export function ThinkingBlock({ thinking }: ThinkingBlockProps) {
  return (
    <details className='group'>
      <summary className='cursor-pointer p-3 rounded-lg border text-sm flex items-center gap-2 hover:bg-muted/30 transition-colors'>
        <Brain className='h-4 w-4 text-muted-foreground' />
        <span className='text-muted-foreground'>
          Цепочка размышлений ({thinking.length})
        </span>
        <span className='ml-auto text-xs text-muted-foreground'>
          {thinking.reduce((sum, t) => sum + (t.duration || 0), 0)}
          ms
        </span>
      </summary>
      <div className='mt-2 space-y-2 pl-4 border-l-2 border-muted'>
        {thinking.map(think => (
          <div key={think.id} className='p-3 rounded-lg border text-sm'>
            <p className='text-muted-foreground italic'>{think.content}</p>
            {think.duration && (
              <p className='text-xs text-muted-foreground mt-1'>
                {think.duration}ms
              </p>
            )}
          </div>
        ))}
      </div>
    </details>
  );
}
