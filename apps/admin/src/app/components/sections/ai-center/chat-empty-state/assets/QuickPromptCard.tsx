import {
  FileText,
  Sparkles,
  Lightbulb,
  Zap,
  PenLine,
  TrendingUp,
  Search,
} from 'lucide-react';
import type { QuickPrompt } from '../chat-empty-state.constants';

const ICON_MAP = {
  FileText,
  Sparkles,
  Lightbulb,
  Zap,
  PenLine,
  TrendingUp,
  Search,
} as const;

interface QuickPromptCardProps {
  prompt: QuickPrompt;
  onClick: () => void;
}

export function QuickPromptCard({ prompt, onClick }: QuickPromptCardProps) {
  const Icon = ICON_MAP[prompt.icon];

  return (
    <button
      onClick={onClick}
      className='group p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left'
    >
      <div className='flex items-start gap-3'>
        <div className='flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
          <Icon className='h-5 w-5 text-primary' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-medium mb-1'>{prompt.label}</h3>
          <p className='text-sm text-muted-foreground'>{prompt.description}</p>
        </div>
      </div>
    </button>
  );
}
