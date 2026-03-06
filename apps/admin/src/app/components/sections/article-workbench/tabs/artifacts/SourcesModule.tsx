import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { SourceItem, SourceType } from '@/app/types/article-editor';
import { AiButton } from './AiButton';
import { nextId } from './artifacts.utils';

const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  article: 'Статья',
  book: 'Книга',
  video: 'Видео',
  tool: 'Инструмент',
};

interface SourcesModuleProps {
  items: SourceItem[];
  onChange: (items: SourceItem[]) => void;
}

export function SourcesModule({ items, onChange }: SourcesModuleProps) {
  const updateItem = (
    id: string,
    field: keyof Omit<SourceItem, 'id'>,
    value: string
  ) => {
    onChange(items.map(it => (it.id === id ? { ...it, [field]: value } : it)));
  };
  const removeItem = (id: string) => onChange(items.filter(it => it.id !== id));
  const addItem = () =>
    onChange([
      ...items,
      { id: nextId('src'), title: '', url: '', type: 'article' as SourceType },
    ]);

  return (
    <div className='space-y-3'>
      {items.map(item => (
        <div
          key={item.id}
          className='group/item flex items-start gap-2 p-3 rounded-md border'
        >
          <div className='flex-1 space-y-1.5'>
            <div className='flex gap-1.5'>
              <Input
                placeholder='Название источника...'
                value={item.title}
                onChange={e => updateItem(item.id, 'title', e.target.value)}
                className='flex-1'
              />
              <Select
                value={item.type}
                onValueChange={v => updateItem(item.id, 'type', v)}
              >
                <SelectTrigger className='w-[120px]' size='sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(SOURCE_TYPE_LABELS) as [SourceType, string][]
                  ).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder='https://...'
              value={item.url}
              onChange={e => updateItem(item.id, 'url', e.target.value)}
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
          Добавить источник
        </Button>
        <AiButton label='Импорт из Workspace' />
      </div>
    </div>
  );
}
