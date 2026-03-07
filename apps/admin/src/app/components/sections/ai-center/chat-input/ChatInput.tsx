import { useRef, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Send, Paperclip } from 'lucide-react';
import { useAIStore } from '@/app/store/ai-store';
import type { Attachment } from '@/app/store/ai-store';
import { AttachmentList } from './assets/AttachmentList';
import { ModelSelector } from './assets/ModelSelector';
import { DropZone } from './assets/DropZone';

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

  const handleFilesDropped = (droppedAttachments: Attachment[]) => {
    droppedAttachments.forEach(attachment => addAttachment(attachment));
  };

  return (
    <div className='flex-shrink-0 border-t p-4 bg-background'>
      <div className='max-w-4xl mx-auto'>
        <AttachmentList attachments={attachments} onRemove={removeAttachment} />

        <DropZone onFilesDropped={handleFilesDropped}>
          <div className='flex items-end gap-2 p-2 bg-muted/30 rounded-lg'>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />

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
        </DropZone>

        {/* Подсказка */}
        <p className='text-xs text-muted-foreground text-center mt-2'>
          AI может совершать ошибки. Проверяйте важную информацию.
        </p>
      </div>
    </div>
  );
}
