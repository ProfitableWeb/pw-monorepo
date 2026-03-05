import { useState, useEffect } from 'react';
import { Pencil, Save, X, Calendar, Tag } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/components/ui/utils';
import type { KBArticle } from './kb-types';

interface KBArticleEditorProps {
  article: KBArticle;
}

export function KBArticleEditor({ article }: KBArticleEditorProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(article.content);

  // Reset state when switching articles
  useEffect(() => {
    setEditing(false);
    setEditContent(article.content);
  }, [article.id]);

  const handleSave = () => {
    // TODO: persist changes
    setEditing(false);
  };

  const handleCancel = () => {
    setEditContent(article.content);
    setEditing(false);
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b shrink-0'>
        <div>
          <h2 className='text-lg font-semibold'>{article.title}</h2>
          <div className='flex items-center gap-3 mt-1.5 text-xs text-muted-foreground'>
            <span className='inline-flex items-center gap-1'>
              <Calendar className='size-3' />
              {article.updatedAt}
            </span>
            {article.tags && article.tags.length > 0 && (
              <span className='inline-flex items-center gap-1'>
                <Tag className='size-3' />
                {article.tags.join(', ')}
              </span>
            )}
          </div>
        </div>
        <div className='flex items-center gap-2 shrink-0'>
          {editing ? (
            <>
              <Button variant='outline' size='sm' onClick={handleCancel}>
                <X className='size-3.5 mr-1.5' />
                Отмена
              </Button>
              <Button size='sm' onClick={handleSave}>
                <Save className='size-3.5 mr-1.5' />
                Сохранить
              </Button>
            </>
          ) : (
            <Button
              variant='outline'
              size='sm'
              onClick={() => setEditing(true)}
            >
              <Pencil className='size-3.5 mr-1.5' />
              Редактировать
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 min-h-0 overflow-y-auto'>
        {editing ? (
          <div className='p-6'>
            <Textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className='min-h-[400px] font-mono text-sm leading-relaxed'
              placeholder='HTML-содержимое инструкции...'
            />
            <p className='mt-2 text-xs text-muted-foreground'>
              Поддерживается HTML: &lt;h4&gt;, &lt;p&gt;, &lt;ul&gt;,
              &lt;li&gt;, &lt;strong&gt;, &lt;code&gt;, &lt;em&gt;
            </p>
          </div>
        ) : (
          <div
            className={cn(
              'px-6 py-5 text-sm leading-[1.7]',
              // Rich text formatting — те же стили что в InfoHint
              '[&_h4]:text-[13px] [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mb-2 [&_h4]:mt-6 first:[&_h4]:mt-0',
              '[&_p]:text-muted-foreground [&_p]:mb-3 last:[&_p]:mb-0',
              '[&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1.5',
              '[&_li]:leading-[1.6]',
              '[&_strong]:text-foreground/80 [&_strong]:font-medium',
              '[&_em]:italic [&_em]:text-muted-foreground/80',
              '[&_code]:text-xs [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono'
            )}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}
      </div>
    </div>
  );
}
