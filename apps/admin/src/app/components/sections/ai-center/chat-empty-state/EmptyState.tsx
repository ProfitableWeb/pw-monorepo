import { Bot } from 'lucide-react';
import { QUICK_PROMPTS } from './chat-empty-state.constants';
import { QuickPromptCard } from './assets/QuickPromptCard';
import { TemplateDialog } from './assets/TemplateDialog';

interface EmptyStateProps {
  onSetInput: (value: string) => void;
}

export function EmptyState({ onSetInput }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center px-4'>
      <div className='w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6'>
        <Bot className='h-10 w-10 text-primary' />
      </div>

      <h2 className='text-2xl font-semibold mb-3'>Начните новую сессию</h2>
      <p className='text-muted-foreground mb-8 max-w-md'>
        Используйте AI для написания статей, анализа данных, создания контента и
        многого другого.
      </p>

      {/* Быстрые промпты */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl'>
        {QUICK_PROMPTS.map(prompt => (
          <QuickPromptCard
            key={prompt.icon}
            prompt={prompt}
            onClick={() => onSetInput(prompt.prompt)}
          />
        ))}
      </div>

      {/* Кнопка добавления шаблона */}
      <TemplateDialog />
    </div>
  );
}
