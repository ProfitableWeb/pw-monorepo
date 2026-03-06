import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { SelfCheckItem } from '@/app/types/article-editor';
import { AiButton } from './AiButton';
import { nextId } from './artifacts.utils';

interface SelfCheckModuleProps {
  items: SelfCheckItem[];
  onChange: (items: SelfCheckItem[]) => void;
}

export function SelfCheckModule({ items, onChange }: SelfCheckModuleProps) {
  const updateItem = (
    id: string,
    field: 'question' | 'answer',
    value: string
  ) => {
    onChange(items.map(it => (it.id === id ? { ...it, [field]: value } : it)));
  };
  const removeItem = (id: string) => onChange(items.filter(it => it.id !== id));
  const addItem = () =>
    onChange([...items, { id: nextId('sc'), question: '', answer: '' }]);

  return (
    <div className='space-y-3'>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className='group/item space-y-1.5 p-3 rounded-md border'
        >
          <div className='flex items-start gap-2'>
            <span className='text-xs text-muted-foreground tabular-nums mt-2 shrink-0'>
              {idx + 1}.
            </span>
            <div className='flex-1 space-y-1.5'>
              <Input
                placeholder='Вопрос...'
                value={item.question}
                onChange={e => updateItem(item.id, 'question', e.target.value)}
              />
              <Textarea
                placeholder='Ответ / подсказка...'
                value={item.answer}
                onChange={e => updateItem(item.id, 'answer', e.target.value)}
                rows={2}
                className='resize-none'
              />
            </div>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-7 text-muted-foreground/40 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0 mt-1'
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className='size-3.5' />
            </Button>
          </div>
        </div>
      ))}
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='gap-1.5 text-xs'
          onClick={addItem}
        >
          <Plus className='size-3.5' />
          Добавить вопрос
        </Button>
        <AiButton label='Сгенерировать вопросы' />
      </div>
    </div>
  );
}
