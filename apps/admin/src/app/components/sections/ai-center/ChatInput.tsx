import { useRef, useState, useEffect } from 'react';
import { cn } from '@/app/components/ui/utils';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectSeparator,
} from '@/app/components/ui/select';
import { Send, Paperclip, X, Settings } from 'lucide-react';
import { useAIStore } from '@/app/store/ai-store';
import type { Attachment } from '@/app/store/ai-store';
import { AI_MODELS } from './ai-center.constants';
import { formatFileSize, getFileIcon } from './ai-center.utils';

interface ChatInputProps {
  onSend: () => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const input = useAIStore(state => state.input);
  const setInput = useAIStore(state => state.setInput);
  const selectedModel = useAIStore(state => state.selectedModel);
  const setSelectedModel = useAIStore(state => state.setSelectedModel);
  const attachments = useAIStore(state => state.attachments);
  const addAttachment = useAIStore(state => state.addAttachment);
  const removeAttachment = useAIStore(state => state.removeAttachment);

  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Авто-ресайз textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    newAttachments.forEach(attachment => addAttachment(attachment));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleConfigureModels = () => {
    // TODO: Open models configuration dialog
    console.log('Configure models clicked');
  };

  const handleModelChange = (value: string) => {
    if (value === '__configure__') {
      handleConfigureModels();
      return;
    }
    setSelectedModel(value);
  };

  return (
    <div className='flex-shrink-0 border-t p-4 bg-background'>
      <div className='max-w-4xl mx-auto'>
        {/* Превью вложений */}
        {attachments.length > 0 && (
          <div className='mb-3 flex flex-wrap gap-2'>
            {attachments.map(attachment => (
              <div
                key={attachment.id}
                className='flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border text-sm group'
              >
                {getFileIcon(attachment.type)}
                <span className='font-medium'>{attachment.name}</span>
                <span className='text-xs text-muted-foreground'>
                  {formatFileSize(attachment.size)}
                </span>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className='ml-2 opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <X className='h-4 w-4 text-muted-foreground hover:text-foreground' />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Зона Drag & Drop */}
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-transparent'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className='absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10'>
              <div className='text-center'>
                <Paperclip className='h-8 w-8 mx-auto mb-2 text-primary' />
                <p className='text-sm font-medium'>
                  Отпустите файлы для загрузки
                </p>
              </div>
            </div>
          )}

          <div className='flex items-end gap-2 p-2 bg-muted/30 rounded-lg'>
            {/* Выбор модели */}
            <div className='flex-shrink-0'>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className='w-[140px] h-10 text-xs'>
                  {AI_MODELS.find(m => m.id === selectedModel)?.name}
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      <div>
                        <div className='font-medium'>{model.name}</div>
                        <div className='text-xs text-muted-foreground'>
                          {model.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  <SelectItem
                    value='__configure__'
                    onSelect={e => {
                      e.preventDefault();
                      handleConfigureModels();
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <Settings className='h-4 w-4' />
                      <span>Настроить список моделей</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Поле ввода */}
            <div className='flex-1 min-w-0'>
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Напишите сообщение... (Shift+Enter для новой строки)'
                className='min-h-[40px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
                rows={1}
              />
            </div>

            {/* Действия */}
            <div className='flex items-center gap-1 flex-shrink-0'>
              <input
                ref={fileInputRef}
                type='file'
                multiple
                onChange={e => handleFileSelect(e.target.files)}
                className='hidden'
              />
              <Button
                variant='ghost'
                size='icon'
                onClick={() => fileInputRef.current?.click()}
                className='h-10 w-10'
              >
                <Paperclip className='h-4 w-4' />
              </Button>
              <Button
                size='icon'
                onClick={onSend}
                disabled={!input.trim() && attachments.length === 0}
                className='h-10 w-10'
              >
                <Send className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>

        {/* Подсказка */}
        <p className='text-xs text-muted-foreground text-center mt-2'>
          AI может совершать ошибки. Проверяйте важную информацию.
        </p>
      </div>
    </div>
  );
}
