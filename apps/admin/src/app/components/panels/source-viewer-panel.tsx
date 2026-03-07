import { ExternalLink, Quote } from 'lucide-react';
import { useResearchStore } from '@/app/store/research-store';
import type { PanelComponentProps } from '@/app/components/workspace/panel-registry';

export function SourceViewerPanel({ itemId }: PanelComponentProps) {
  const { sources } = useResearchStore();
  const source = sources.find(s => s.id === itemId);

  if (!source) {
    return (
      <div className='flex items-center justify-center h-full text-muted-foreground text-sm'>
        Источник не найден
      </div>
    );
  }

  return (
    <div className='p-4 space-y-4 overflow-auto h-full'>
      {/* Заголовок */}
      <h2 className='font-semibold text-base'>{source.title}</h2>

      {/* URL */}
      {source.url && (
        <a
          href={source.url}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-1.5 text-sm text-primary hover:underline'
        >
          <ExternalLink className='h-3.5 w-3.5' />
          {source.url}
        </a>
      )}

      {/* Аннотация */}
      {source.annotation && (
        <div>
          <h3 className='text-xs font-medium text-muted-foreground mb-1.5'>
            Аннотация
          </h3>
          <p className='text-sm leading-relaxed'>{source.annotation}</p>
        </div>
      )}

      {/* Цитаты */}
      {source.quotes.length > 0 && (
        <div>
          <h3 className='text-xs font-medium text-muted-foreground mb-2'>
            Цитаты ({source.quotes.length})
          </h3>
          <div className='space-y-2'>
            {source.quotes.map((quote, i) => (
              <blockquote
                key={i}
                className='border-l-2 border-primary/30 pl-3 py-1 text-sm text-muted-foreground italic'
              >
                <Quote className='h-3 w-3 inline-block mr-1 opacity-40' />
                {quote}
              </blockquote>
            ))}
          </div>
        </div>
      )}

      {/* Метаданные */}
      <div className='text-xs text-muted-foreground/60 pt-2 border-t'>
        Добавлено {new Date(source.createdAt).toLocaleDateString('ru-RU')}
      </div>
    </div>
  );
}
