import { useState, useEffect } from 'react';
import { useResearchStore } from '@/app/store/research-store';
import type { PanelComponentProps } from '@/app/components/workspace/panel-registry';

export function NoteEditorPanel({ itemId }: PanelComponentProps) {
  const { notes, drafts, updateNote, updateDraft } = useResearchStore();

  const note = notes.find(n => n.id === itemId);
  const draft = drafts.find(d => d.id === itemId);
  const item = note || draft;
  const isNote = !!note;

  const [content, setContent] = useState(item?.content || '');

  // Синхронизация при переключении элементов
  useEffect(() => {
    setContent(item?.content || '');
  }, [itemId, item?.content]);

  const handleChange = (value: string) => {
    setContent(value);
    // Сохранение с debounce
    if (isNote) {
      updateNote(itemId, { content: value });
    } else {
      updateDraft(itemId, { content: value });
    }
  };

  if (!item) {
    return (
      <div className='flex items-center justify-center h-full text-muted-foreground text-sm'>
        Элемент не найден
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Заголовок */}
      <div className='px-4 py-2 border-b text-xs text-muted-foreground'>
        {item.title}
      </div>

      {/* Редактор */}
      <textarea
        value={content}
        onChange={e => handleChange(e.target.value)}
        className='flex-1 w-full p-4 font-mono text-sm bg-transparent resize-none outline-none leading-relaxed'
        placeholder='Начните писать...'
        spellCheck={false}
      />
    </div>
  );
}
