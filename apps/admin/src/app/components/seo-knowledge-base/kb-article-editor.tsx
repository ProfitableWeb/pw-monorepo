import { useState, useEffect } from 'react';
import { Pencil, Check, X, Calendar, Tag } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';
import type { KBArticle } from './kb-types';

interface KBArticleEditorProps {
  article: KBArticle;
}

export function KBArticleEditor({ article }: KBArticleEditorProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(article.content);
  const [editTags, setEditTags] = useState(article.tags?.join(', ') || '');
  const isWelcome = article.id === 'welcome';

  // Сброс состояния при переключении статей
  useEffect(() => {
    setEditing(false);
    setEditContent(article.content);
    setEditTags(article.tags?.join(', ') || '');
  }, [article.id]);

  const handleSave = () => {
    // TODO: persist changes
    setEditing(false);
  };

  const handleCancel = () => {
    setEditContent(article.content);
    setEditTags(article.tags?.join(', ') || '');
    setEditing(false);
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Заголовок */}
      {isWelcome ? (
        <div className='flex items-start justify-between gap-4 px-6 pt-6 pb-4 shrink-0'>
          <div>
            <h2 className='text-lg font-semibold'>{article.title}</h2>
            <p className='text-sm text-muted-foreground mt-1'>
              Инструкции и стратегии для команды и AI-агентов
            </p>
          </div>
          <div className='shrink-0 flex items-center h-8'>
            {editing ? (
              <>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-8 text-muted-foreground'
                  onClick={handleCancel}
                >
                  <X className='size-3.5' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-8'
                  onClick={handleSave}
                >
                  <Check className='size-3.5' />
                </Button>
              </>
            ) : (
              <Button
                variant='ghost'
                size='icon'
                className='size-8 text-muted-foreground'
                onClick={() => setEditing(true)}
              >
                <Pencil className='size-3.5' />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className='flex items-start justify-between gap-4 px-6 pt-6 pb-4 shrink-0'>
          <div>
            <h2 className='text-lg font-semibold'>{article.title}</h2>
            <div className='flex items-center gap-3 mt-1.5 h-5 text-xs text-muted-foreground'>
              <span className='inline-flex items-center gap-1'>
                <Calendar className='size-3' />
                {article.updatedAt}
              </span>
              {editing ? (
                <span className='inline-flex items-center gap-1'>
                  <Tag className='size-3 shrink-0' />
                  <input
                    type='text'
                    value={editTags}
                    onChange={e => setEditTags(e.target.value)}
                    placeholder='теги через запятую'
                    className='bg-transparent border-b border-muted-foreground/30 outline-none text-xs min-w-[120px]'
                  />
                </span>
              ) : (
                article.tags &&
                article.tags.length > 0 && (
                  <span className='inline-flex items-center gap-1'>
                    <Tag className='size-3' />
                    {article.tags.join(', ')}
                  </span>
                )
              )}
            </div>
          </div>
          <div className='shrink-0 flex items-center h-8'>
            {editing ? (
              <>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-8 text-muted-foreground'
                  onClick={handleCancel}
                >
                  <X className='size-3.5' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-8'
                  onClick={handleSave}
                >
                  <Check className='size-3.5' />
                </Button>
              </>
            ) : (
              <Button
                variant='ghost'
                size='icon'
                className='size-8 text-muted-foreground'
                onClick={() => setEditing(true)}
              >
                <Pencil className='size-3.5' />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Контент */}
      <div className='flex-1 min-h-0 overflow-y-auto'>
        {editing ? (
          <div className='flex flex-col h-full p-6 pt-0'>
            <div className='flex-1 min-h-0 rounded-md overflow-hidden border'>
              <Editor
                height='100%'
                language='html'
                value={editContent}
                onChange={value => setEditContent(value || '')}
                theme='vs-dark'
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                }}
              />
            </div>
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
