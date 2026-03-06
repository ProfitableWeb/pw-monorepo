import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { GlossaryItem } from '@/app/types/article-editor';
import { AiButton } from './AiButton';
import { nextId } from './artifacts.utils';

interface GlossaryModuleProps {
  items: GlossaryItem[];
  onChange: (items: GlossaryItem[]) => void;
}

export function GlossaryModule({ items, onChange }: GlossaryModuleProps) {
  const updateItem = (
    id: string,
    field: 'term' | 'definition',
    value: string
  ) => {
    onChange(items.map(it => (it.id === id ? { ...it, [field]: value } : it)));
  };
  const removeItem = (id: string) => onChange(items.filter(it => it.id !== id));
  const addItem = () =>
    onChange([...items, { id: nextId('gl'), term: '', definition: '' }]);

  return (
    <div className='space-y-3'>
      {items.map(item => (
        <div
          key={item.id}
          className='group/item flex items-start gap-2 p-3 rounded-md border'
        >
          <div className='flex-1 space-y-1.5'>
            <Input
              placeholder='Термин...'
              value={item.term}
              onChange={e => updateItem(item.id, 'term', e.target.value)}
            />
            <Textarea
              placeholder='Определение...'
              value={item.definition}
              onChange={e => updateItem(item.id, 'definition', e.target.value)}
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
          Добавить термин
        </Button>
        <AiButton label='Найти термины в тексте' />
      </div>
    </div>
  );
}
