/** PW-064 | Диалог редактирования AI-провайдера. */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useUpdateAiProvider } from '@/hooks/api';
import {
  testAiProvider,
  testAiProviderRaw,
  getAiProviderKey,
} from '@/lib/api-client';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Loader2,
  Zap,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  X,
} from 'lucide-react';
import type { AiProvider, AiProviderTestResult } from './ai-center.types';

interface Props {
  open: boolean;
  provider: AiProvider;
  onClose: () => void;
}

export function EditProviderDialog({ open, provider, onClose }: Props) {
  const [name, setName] = useState(provider.name);
  const [baseUrl, setBaseUrl] = useState(provider.baseUrl ?? '');
  const [modelName, setModelName] = useState(provider.modelName);
  const [newApiKey, setNewApiKey] = useState('');
  const [showNewKey, setShowNewKey] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [loadingSavedKey, setLoadingSavedKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [maxContextTokens, setMaxContextTokens] = useState(
    provider.maxContextTokens?.toString() ?? ''
  );
  const [description, setDescription] = useState(provider.description ?? '');
  const [testResult, setTestResult] = useState<AiProviderTestResult | null>(
    null
  );

  const updateMutation = useUpdateAiProvider();

  const testMutation = useMutation({
    mutationFn: () => {
      if (newApiKey.trim()) {
        return testAiProviderRaw({
          api_type: provider.apiType,
          api_key: newApiKey.trim(),
          base_url:
            provider.apiType === 'openai_compatible'
              ? baseUrl.trim() || null
              : null,
          model_name: modelName.trim(),
        });
      }
      return testAiProvider(provider.id);
    },
    onSuccess: result => setTestResult(result),
    onError: () =>
      setTestResult({
        success: false,
        latencyMs: 0,
        modelResponse: null,
        error: 'Ошибка сети',
      }),
  });

  const canSubmit = name.trim() && modelName.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;

    const data: Record<string, unknown> = {};
    if (name.trim() !== provider.name) data.name = name.trim();
    if (modelName.trim() !== provider.modelName)
      data.model_name = modelName.trim();
    if (newApiKey.trim()) data.api_key = newApiKey.trim();
    if (description.trim() !== (provider.description ?? ''))
      data.description = description.trim() || null;

    if (provider.apiType === 'openai_compatible') {
      const newUrl = baseUrl.trim() || null;
      if (newUrl !== provider.baseUrl) data.base_url = newUrl;
    }

    const newTokens = maxContextTokens ? parseInt(maxContextTokens, 10) : null;
    if (newTokens !== provider.maxContextTokens)
      data.max_context_tokens = newTokens;

    if (Object.keys(data).length === 0) {
      onClose();
      return;
    }

    updateMutation.mutate(
      { id: provider.id, data },
      { onSuccess: () => onClose() }
    );
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
      <div className='bg-card border rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]'>
        {/* Шапка — фиксирована */}
        <div className='flex items-center justify-between px-6 py-4 border-b shrink-0'>
          <h3 className='text-lg font-semibold'>
            Редактирование: {provider.name}
          </h3>
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
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>

              {provider.apiType === 'openai_compatible' && (
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
                </div>
              )}

              <div>
                <label className='text-sm font-medium mb-1 block'>Модель</label>
                <Input
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
            </div>

            {/* Правая колонка: ключи + тест */}
            <div className='space-y-4'>
              {/* Текущий ключ */}
              <div>
                <label className='text-sm font-medium mb-1 block'>
                  Текущий API-ключ
                </label>
                <div className='flex items-center gap-2 p-2.5 rounded-md border bg-muted/30'>
                  <code className='text-sm font-mono flex-1 truncate select-all'>
                    {savedKey ?? provider.apiKeyPrefix}
                  </code>
                  <button
                    type='button'
                    className='p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0'
                    onClick={async () => {
                      if (savedKey) {
                        setSavedKey(null);
                        return;
                      }
                      setLoadingSavedKey(true);
                      try {
                        setSavedKey(await getAiProviderKey(provider.id));
                      } catch {
                        /* */
                      }
                      setLoadingSavedKey(false);
                    }}
                    title={savedKey ? 'Скрыть' : 'Показать полный ключ'}
                  >
                    {loadingSavedKey ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : savedKey ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                  {savedKey && (
                    <button
                      type='button'
                      className='p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0'
                      onClick={() => {
                        navigator.clipboard.writeText(savedKey);
                        setCopiedKey(true);
                        setTimeout(() => setCopiedKey(false), 2000);
                      }}
                      title='Скопировать'
                    >
                      {copiedKey ? (
                        <Check className='h-4 w-4 text-green-500' />
                      ) : (
                        <Copy className='h-4 w-4' />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Новый ключ */}
              <div>
                <label className='text-sm font-medium mb-1 block'>
                  Заменить ключ
                  <span className='text-muted-foreground font-normal ml-1'>
                    (необязательно)
                  </span>
                </label>
                <div className='relative'>
                  <Input
                    type={showNewKey ? 'text' : 'password'}
                    placeholder='Вставьте новый ключ...'
                    value={newApiKey}
                    onChange={e => {
                      setNewApiKey(e.target.value);
                      setTestResult(null);
                    }}
                    className='pr-10'
                  />
                  <button
                    type='button'
                    className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors'
                    onClick={() => setShowNewKey(!showNewKey)}
                    tabIndex={-1}
                  >
                    {showNewKey ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </div>

              {/* Проверка подключения */}
              <div className='p-3 rounded-lg border border-dashed space-y-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => testMutation.mutate()}
                  disabled={!modelName.trim() || testMutation.isPending}
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
            {updateMutation.isError && (
              <p className='text-sm text-destructive'>
                {(updateMutation.error as Error)?.message ??
                  'Ошибка обновления'}
              </p>
            )}
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={onClose}>
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <Loader2 className='h-4 w-4 mr-1.5 animate-spin' />
              )}
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
