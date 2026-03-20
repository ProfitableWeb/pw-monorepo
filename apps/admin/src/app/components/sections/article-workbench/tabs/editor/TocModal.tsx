/**
 * Модальное окно генерации и редактирования Table of Contents.
 *
 * Парсит заголовки (h2–h4) из HTML-контента, позволяет включать/выключать
 * каждый пункт, показывает превью иерархии.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { RefreshCw } from 'lucide-react';
import type { TocItem } from '@/app/types/article-editor';

/** Парсит заголовки h2–h4 из HTML-строки */
function parseHeadings(html: string): TocItem[] {
  const re = /<h([2-4])([^>]*)>([\s\S]*?)<\/h[2-4]>/gi;
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = re.exec(html)) !== null) {
    const level = Number(match[1]);
    const attrsStr = match[2] ?? '';
    const innerHtml = match[3] ?? '';

    // Извлекаем id из атрибутов, если есть
    const idMatch = attrsStr.match(/id\s*=\s*["']([^"']+)["']/i);

    // Убираем HTML-теги для чистого текста
    const text = innerHtml.replace(/<[^>]+>/g, '').trim();
    if (!text) continue;

    // id: из атрибута или генерируем из текста
    const id =
      idMatch?.[1] ||
      text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-')
        .slice(0, 80);

    items.push({ id, text, level, enabled: true });
  }

  return items;
}

/** Мержит новые спарсенные заголовки с предыдущим состоянием (сохраняет enabled) */
function mergeWithExisting(parsed: TocItem[], existing: TocItem[]): TocItem[] {
  const map = new Map(existing.map(item => [item.id, item]));
  return parsed.map(item => ({
    ...item,
    enabled: map.get(item.id)?.enabled ?? true,
  }));
}

interface TocModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  toc: TocItem[];
  onSave: (toc: TocItem[]) => void;
}

export function TocModal({
  open,
  onOpenChange,
  content,
  toc,
  onSave,
}: TocModalProps) {
  const [items, setItems] = useState<TocItem[]>([]);

  // При открытии: мержим спарсенные заголовки с текущим toc
  useEffect(() => {
    if (open) {
      const parsed = parseHeadings(content);
      setItems(mergeWithExisting(parsed, toc));
    }
  }, [open, content, toc]);

  const handleToggle = useCallback((id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  }, []);

  const handleToggleAll = useCallback((enabled: boolean) => {
    setItems(prev => prev.map(item => ({ ...item, enabled })));
  }, []);

  const handleReparse = useCallback(() => {
    const parsed = parseHeadings(content);
    setItems(mergeWithExisting(parsed, items));
  }, [content, items]);

  const handleSave = useCallback(() => {
    onSave(items);
    onOpenChange(false);
  }, [items, onSave, onOpenChange]);

  const allEnabled = useMemo(
    () => items.length > 0 && items.every(i => i.enabled),
    [items]
  );
  const noneEnabled = useMemo(
    () => items.length > 0 && items.every(i => !i.enabled),
    [items]
  );
  const enabledCount = useMemo(
    () => items.filter(i => i.enabled).length,
    [items]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg max-h-[80vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>Оглавление (Table of Contents)</DialogTitle>
          <DialogDescription>
            Заголовки извлечены из контента. Снимите флажок, чтобы исключить
            пункт из оглавления.
          </DialogDescription>
        </DialogHeader>

        {items.length === 0 ? (
          <p className='text-sm text-muted-foreground py-6 text-center'>
            В контенте не найдено заголовков (h2–h4).
          </p>
        ) : (
          <>
            <div className='flex items-center justify-between text-xs text-muted-foreground pb-1'>
              <span>
                {enabledCount} из {items.length} включено
              </span>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  className='hover:text-foreground transition-colors'
                  onClick={() => handleToggleAll(!allEnabled)}
                >
                  {allEnabled ? 'Снять все' : 'Выбрать все'}
                </button>
                <button
                  type='button'
                  className='hover:text-foreground transition-colors flex items-center gap-1'
                  onClick={handleReparse}
                  title='Обновить из контента'
                >
                  <RefreshCw className='size-3' />
                  Обновить
                </button>
              </div>
            </div>

            <div className='flex-1 min-h-0 overflow-y-auto space-y-0.5 border rounded-md p-3'>
              {items.map(item => (
                <label
                  key={item.id}
                  className='flex items-start gap-2 py-1 cursor-pointer hover:bg-accent/50 rounded px-1 -mx-1'
                  style={{ paddingLeft: `${(item.level - 2) * 20 + 4}px` }}
                >
                  <Checkbox
                    checked={item.enabled}
                    onCheckedChange={() => handleToggle(item.id)}
                    className='mt-0.5'
                  />
                  <span
                    className={`text-sm ${
                      item.enabled
                        ? 'text-foreground'
                        : 'text-muted-foreground line-through'
                    } ${item.level === 2 ? 'font-medium' : ''}`}
                  >
                    <span className='text-xs text-muted-foreground mr-1.5'>
                      H{item.level}
                    </span>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={noneEnabled && items.length > 0}
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
