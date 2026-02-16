import { Sparkles } from 'lucide-react';
import type { PanelComponentProps } from '@/app/components/workspace/panel-registry';

export function AiChatPanel(_props: PanelComponentProps) {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='text-center text-muted-foreground'>
        <Sparkles className='h-12 w-12 mx-auto mb-4 opacity-15' />
        <p className='text-sm font-medium mb-1'>AI-ассистент</p>
        <p className='text-xs'>Чат в контексте исследования — PW-039</p>
      </div>
    </div>
  );
}
