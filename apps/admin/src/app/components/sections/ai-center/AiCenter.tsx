import { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Button } from '@/app/components/ui/button';
import { useAIStore } from '@/app/store/ai-store';
import { AI_MODELS } from './ai-center.constants';
import { MessageItem, StreamingIndicator } from './chat-message';
import { EmptyState } from './chat-empty-state';
import { ChatInput } from './chat-input';
import { AiProviders } from './AiProviders';
import { MessageSquare, Network } from 'lucide-react';

type Tab = 'chat' | 'providers';

export function AICenter() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

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

  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      setInput(initialPrompt);
      setInitialPrompt(null);
      setTimeout(() => {
        handleSend();
      }, 500);
    }
  }, [initialPrompt, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
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

  const tabs: { id: Tab; label: string; icon: typeof MessageSquare }[] = [
    { id: 'chat', label: 'Чат', icon: MessageSquare },
    { id: 'providers', label: 'Провайдеры', icon: Network },
  ];

  return (
    <div className='flex flex-col h-full'>
      {/* Вкладки */}
      <div className='flex items-center gap-1 px-4 pt-3 pb-0 border-b'>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant='ghost'
              size='sm'
              className={`gap-1.5 rounded-b-none border-b-2 ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className='h-4 w-4' />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Контент вкладки */}
      {activeTab === 'chat' && (
        <>
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
          <ChatInput onSend={handleSend} />
        </>
      )}

      {activeTab === 'providers' && <AiProviders />}
    </div>
  );
}
