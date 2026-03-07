import { useState } from 'react';
import { cn } from '@/app/components/ui/utils';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAIStore } from '@/app/store/ai-store';
import type { Message } from '@/app/store/ai-store';
import { formatFileSize, getFileIcon } from '../ai-center.utils';
import { ThinkingBlock } from './assets/ThinkingBlock';
import { ToolCallsBlock } from './assets/ToolCallsBlock';
import { MessageActions } from './assets/MessageActions';
import { EditMessageDialog } from './assets/EditMessageDialog';

interface MessageItemProps {
  message: Message;
  aiModels: Array<{ id: string; name: string; description: string }>;
}

export function MessageItem({ message, aiModels }: MessageItemProps) {
  const setCurrentVariant = useAIStore(state => state.setCurrentVariant);
  const addMessageVariant = useAIStore(state => state.addMessageVariant);
  const setIsStreaming = useAIStore(state => state.setIsStreaming);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const currentVariant = message.variants[message.currentVariantIndex];
  const hasMultipleVariants = message.variants.length > 1;

  if (!currentVariant) return null;

  const handlePrevVariant = () => {
    if (message.currentVariantIndex > 0) {
      setCurrentVariant(message.id, message.currentVariantIndex - 1);
    }
  };

  const handleNextVariant = () => {
    if (message.currentVariantIndex < message.variants.length - 1) {
      setCurrentVariant(message.id, message.currentVariantIndex + 1);
    }
  };

  const handleStartEdit = () => {
    setEditContent(currentVariant.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;

    // Создать новый вариант с отредактированным содержимым
    addMessageVariant(message.id, {
      role: currentVariant.role,
      content: editContent,
      attachments: currentVariant.attachments,
    });

    // Переключиться на новый вариант
    setCurrentVariant(message.id, message.variants.length);

    setIsEditing(false);
    setEditContent('');

    // Если это сообщение пользователя — сгенерировать новый ответ AI
    if (currentVariant.role === 'user') {
      setIsStreaming(true);
      setTimeout(() => {
        addMessageVariant(message.id, {
          role: 'assistant',
          content: 'Я обработал ваш обновленный запрос. Вот новый ответ...',
          thinking: [
            {
              id: 't' + Date.now(),
              content:
                'Анализирую обновленный запрос и формирую новый ответ...',
              duration: 1500,
            },
          ],
        });
        setIsStreaming(false);
      }, 2000);
    }
  };

  const handleRegenerate = () => {
    if (currentVariant.role !== 'assistant') return;

    setIsStreaming(true);
    setTimeout(() => {
      addMessageVariant(message.id, {
        role: 'assistant',
        content: 'Это регенерированый вариант ответа с другой формулировкой...',
        thinking: [
          {
            id: 't' + Date.now(),
            content: 'Генерирую альтернативный вариант ответа...',
            duration: 1200,
          },
        ],
      });

      // Переключиться на новый вариант
      setCurrentVariant(message.id, message.variants.length);
      setIsStreaming(false);
    }, 2000);
  };

  return (
    <>
      <div
        key={message.id}
        className={cn(
          'flex gap-4',
          currentVariant.role === 'user' ? 'justify-end' : 'justify-start'
        )}
      >
        {currentVariant.role === 'assistant' && (
          <div className='flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
            <Bot className='h-5 w-5 text-primary' />
          </div>
        )}

        <div
          className={cn(
            'flex-1 max-w-3xl space-y-2',
            currentVariant.role === 'user' && 'flex flex-col items-end'
          )}
        >
          {/* Заголовок сообщения с навигацией по вариантам */}
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            {currentVariant.role === 'assistant' && currentVariant.model && (
              <Badge variant='outline' className='text-xs'>
                {aiModels.find(m => m.id === currentVariant.model)?.name}
              </Badge>
            )}
            <span>
              {currentVariant.timestamp.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>

            {/* Навигация по вариантам */}
            {hasMultipleVariants && (
              <div className='flex items-center gap-1 ml-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-5 w-5'
                  onClick={handlePrevVariant}
                  disabled={message.currentVariantIndex === 0}
                >
                  <ChevronLeft className='h-3 w-3' />
                </Button>
                <span className='text-xs px-1'>
                  {message.currentVariantIndex + 1} / {message.variants.length}
                </span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-5 w-5'
                  onClick={handleNextVariant}
                  disabled={
                    message.currentVariantIndex === message.variants.length - 1
                  }
                >
                  <ChevronRight className='h-3 w-3' />
                </Button>
              </div>
            )}
          </div>

          {/* Блоки размышлений */}
          {currentVariant.thinking && currentVariant.thinking.length > 0 && (
            <ThinkingBlock thinking={currentVariant.thinking} />
          )}

          {/* Вызовы инструментов */}
          {currentVariant.toolCalls && currentVariant.toolCalls.length > 0 && (
            <ToolCallsBlock toolCalls={currentVariant.toolCalls} />
          )}

          {/* Вложения */}
          {currentVariant.attachments &&
            currentVariant.attachments.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {currentVariant.attachments.map(attachment => (
                  <div
                    key={attachment.id}
                    className='flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border text-sm'
                  >
                    {getFileIcon(attachment.type)}
                    <span className='font-medium'>{attachment.name}</span>
                    <span className='text-xs text-muted-foreground'>
                      {formatFileSize(attachment.size)}
                    </span>
                  </div>
                ))}
              </div>
            )}

          {/* Содержимое сообщения */}
          <div
            className={cn(
              'p-4 rounded-lg',
              currentVariant.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 border'
            )}
          >
            {currentVariant.role === 'assistant' ? (
              <div className='text-sm leading-[1.7] prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h1:mt-6 prose-h1:mb-3 prose-h2:text-lg prose-h2:mt-5 prose-h2:mb-2.5 prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2 prose-p:my-3 prose-p:leading-[1.7] prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-pre:my-3 prose-pre:bg-muted prose-pre:text-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-blockquote:my-3 prose-blockquote:border-l-primary prose-hr:my-4 prose-strong:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline'>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentVariant.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className='text-sm whitespace-pre-wrap leading-relaxed'>
                {currentVariant.content}
              </p>
            )}
          </div>

          {/* Действия с сообщением */}
          <MessageActions
            role={currentVariant.role}
            content={currentVariant.content}
            onEdit={handleStartEdit}
            onRegenerate={handleRegenerate}
          />
        </div>

        {currentVariant.role === 'user' && (
          <div className='flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center'>
            <User className='h-5 w-5' />
          </div>
        )}
      </div>

      {/* Диалог редактирования сообщения */}
      <EditMessageDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        content={editContent}
        onContentChange={setEditContent}
        onCancel={handleCancelEdit}
        onSave={handleSaveEdit}
      />
    </>
  );
}
