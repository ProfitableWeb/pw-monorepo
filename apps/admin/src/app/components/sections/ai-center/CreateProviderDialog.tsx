/** PW-064 | Диалог создания AI-провайдера с проверкой подключения. */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useCreateAiProvider } from '@/hooks/api';
import { testAiProviderRaw } from '@/lib/api-client';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Loader2,
  Zap,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import type { AiApiType, AiProviderTestResult } from './ai-center.types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateProviderDialog({ open, onClose }: Props) {
  const [name, setName] = useState('');
  const [apiType, setApiType] = useState<AiApiType>('openai_compatible');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [modelName, setModelName] = useState('');
  const [maxContextTokens, setMaxContextTokens] = useState('');
  const [description, setDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [testResult, setTestResult] = useState<AiProviderTestResult | null>(
    null
  );

  const createMutation = useCreateAiProvider();

  const testMutation = useMutation({
    mutationFn: () =>
      testAiProviderRaw({
        api_type: apiType,
        api_key: apiKey.trim(),
        base_url:
          apiType === 'openai_compatible' && baseUrl.trim()
            ? baseUrl.trim()
            : null,
        model_name: modelName.trim(),
      }),
    onSuccess: result => setTestResult(result),
    onError: () =>
      setTestResult({
        success: false,
        latencyMs: 0,
        modelResponse: null,
        error: 'Ошибка сети',
      }),
  });

  const canTest = apiKey.trim() && modelName.trim();
  const canSubmit = name.trim() && canTest;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createMutation.mutate(
      {
        name: name.trim(),
        api_type: apiType,
        api_key: apiKey.trim(),
        base_url:
          apiType === 'openai_compatible' && baseUrl.trim()
            ? baseUrl.trim()
            : null,
        model_name: modelName.trim(),
        max_context_tokens: maxContextTokens
          ? parseInt(maxContextTokens, 10)
          : null,
        description: description.trim() || null,
        is_default: isDefault,
      },
      { onSuccess: () => onClose() }
    );
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
      <div className='bg-card border rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]'>
        {/* Шапка — фиксирована */}
        <div className='flex items-center justify-between px-6 py-4 border-b shrink-0'>
          <h3 className='text-lg font-semibold'>Новый провайдер</h3>
          <button
            onClick={onClose}
            className='p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Контент — прокручивается */}
        <div className='flex-1 overflow-y-auto px-6 py-5'>
          <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
            {/* Левая колонка: конфигурация */}
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium mb-1 block'>
                  Название
                </label>
                <Input
                  placeholder='Например: OpenAI Production'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <label className='text-sm font-medium mb-1 block'>
                  Тип API
                </label>
                <select
                  className='w-full rounded-md border bg-background px-3 py-2 text-sm'
                  value={apiType}
                  onChange={e => {
                    setApiType(e.target.value as AiApiType);
                    setTestResult(null);
                  }}
                >
                  <option value='openai_compatible'>
                    OpenAI-совместимый (OpenAI, vLLM, Ollama, Groq...)
                  </option>
                  <option value='anthropic'>Anthropic (Claude)</option>
                </select>
              </div>

              {apiType === 'openai_compatible' && (
                <div>
                  <label className='text-sm font-medium mb-1 block'>
                    Base URL
                  </label>
                  <Input
                    placeholder='https://api.openai.com/v1'
                    value={baseUrl}
                    onChange={e => {
                      setBaseUrl(e.target.value);
                      setTestResult(null);
                    }}
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    Для OpenAI можно оставить пустым. Для vLLM/Ollama укажите
                    адрес сервера.
                  </p>
                </div>
              )}

              <div>
                <label className='text-sm font-medium mb-1 block'>Модель</label>
                <Input
                  placeholder={
                    apiType === 'anthropic'
                      ? 'claude-sonnet-4-20250514'
                      : 'gpt-4o'
                  }
                  value={modelName}
                  onChange={e => {
                    setModelName(e.target.value);
                    setTestResult(null);
                  }}
                />
              </div>

              <div>
                <label className='text-sm font-medium mb-1 block'>
                  Контекстное окно (токены)
                </label>
                <Input
                  type='number'
                  placeholder='128000'
                  value={maxContextTokens}
                  onChange={e => setMaxContextTokens(e.target.value)}
                />
              </div>

              <div>
                <label className='text-sm font-medium mb-1 block'>
                  Описание
                </label>
                <Input
                  placeholder='Необязательно'
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <label className='flex items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={isDefault}
                  onChange={e => setIsDefault(e.target.checked)}
                  className='rounded'
                />
                Сделать провайдером по умолчанию
              </label>
            </div>

            {/* Правая колонка: ключ + тест */}
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium mb-1 block'>
                  API-ключ
                </label>
                <div className='relative'>
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    placeholder='sk-...'
                    value={apiKey}
                    onChange={e => {
                      setApiKey(e.target.value);
                      setTestResult(null);
                    }}
                    className='pr-10'
                  />
                  <button
                    type='button'
                    className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors'
                    onClick={() => setShowApiKey(!showApiKey)}
                    tabIndex={-1}
                  >
                    {showApiKey ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  Ключ шифруется при сохранении. В интерфейсе виден только
                  префикс.
                </p>
              </div>

              {/* Проверка подключения */}
              <div className='p-3 rounded-lg border border-dashed space-y-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => testMutation.mutate()}
                  disabled={!canTest || testMutation.isPending}
                  className='w-full'
                >
                  {testMutation.isPending ? (
                    <Loader2 className='h-4 w-4 mr-1.5 animate-spin' />
                  ) : (
                    <Zap className='h-4 w-4 mr-1.5' />
                  )}
                  Проверить подключение
                </Button>
                {testResult && (
                  <div
                    className={`flex items-center gap-1.5 text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {testResult.success ? (
                      <>
                        <CheckCircle2 className='h-4 w-4 shrink-0' />
                        <span>{testResult.latencyMs}ms</span>
                        {testResult.modelResponse && (
                          <span className='opacity-60'>
                            — {testResult.modelResponse}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <XCircle className='h-4 w-4 shrink-0' />
                        <span className='truncate'>{testResult.error}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Футер — фиксирован */}
        <div className='flex items-center justify-between px-6 py-4 border-t shrink-0'>
          <div>
            {createMutation.isError && (
              <p className='text-sm text-destructive'>
                {(createMutation.error as Error)?.message ?? 'Ошибка создания'}
              </p>
            )}
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={onClose}>
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || createMutation.isPending}
            >
              {createMutation.isPending && (
                <Loader2 className='h-4 w-4 mr-1.5 animate-spin' />
              )}
              Создать
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
