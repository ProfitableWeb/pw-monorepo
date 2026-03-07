import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useAIStore } from '@/app/store/ai-store';
import { AI_MODELS } from './ai-center.constants';
import { MessageItem } from './MessageItem';
import { EmptyState } from './EmptyState';
import { StreamingIndicator } from './StreamingIndicator';
import { ChatInput } from './ChatInput';

export function AICenter() {
  const getMessages = useAIStore(state => state.getMessages);
  const messages = getMessages();
  const input = useAIStore(state => state.input);
  const setInput = useAIStore(state => state.setInput);
  const attachments = useAIStore(state => state.attachments);
  const setAttachments = useAIStore(state => state.setAttachments);
  const addMessage = useAIStore(state => state.addMessage);
  const isStreaming = useAIStore(state => state.isStreaming);
  const setIsStreaming = useAIStore(state => state.setIsStreaming);
  const initialPrompt = useAIStore(state => state.initialPrompt);
  const setInitialPrompt = useAIStore(state => state.setInitialPrompt);

  const scrollAreaRef = useRef<React.ElementRef<'div'>>(null);

  // Обработка начального промпта (из визарда Манифеста)
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      setInput(initialPrompt);
      setInitialPrompt(null);
      // Авто-отправка с небольшой задержкой
      setTimeout(() => {
        handleSend();
      }, 500);
    }
  }, [initialPrompt, messages.length]);

  // Авто-скролл вниз при изменении сообщений или стриминга
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        // requestAnimationFrame для завершения обновления DOM
        requestAnimationFrame(() => {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth',
          });
        });
      }
    }
  }, [messages, isStreaming]);

  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return;

    addMessage({
      role: 'user',
      content: input,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    });
    setInput('');
    setAttachments([]);
    setIsStreaming(true);

    // Симуляция ответа AI
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: 'Я обработал ваш запрос. Вот что я могу предложить...',
        thinking: [
          {
            id: 't' + Date.now(),
            content:
              'Анализирую контекст и формирую ответ на основе предыдущих сообщений...',
            duration: 1500,
          },
        ],
      });
      setIsStreaming(false);
    }, 2000);
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Область сообщений */}
      <div className='flex-1 min-h-0'>
        <ScrollArea ref={scrollAreaRef} className='h-full'>
          <div className='max-w-4xl mx-auto space-y-6 p-6 pb-12'>
            {messages.length === 0 && !isStreaming && (
              <EmptyState onSetInput={setInput} />
            )}

            {messages.map(message => (
              <MessageItem
                key={message.id}
                message={message}
                aiModels={AI_MODELS}
              />
            ))}

            {isStreaming && <StreamingIndicator />}
          </div>
        </ScrollArea>
      </div>

      {/* Область ввода — фиксирована внизу */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
