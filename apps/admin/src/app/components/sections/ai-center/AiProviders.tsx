/** PW-064 | Управление AI-провайдерами: таблица с CRUD-операциями. */

import { useState } from 'react';
import {
  useAiProviders,
  useToggleAiProvider,
  useDeleteAiProvider,
  useSetDefaultAiProvider,
  useTestAiProvider,
} from '@/hooks/api';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import {
  Plus,
  Star,
  Trash2,
  Pencil,
  Zap,
  Loader2,
  CheckCircle2,
  XCircle,
  Network,
  Eye,
  EyeOff,
} from 'lucide-react';
import { getAiProviderKey } from '@/lib/api-client';
import type { AiProvider, AiProviderTestResult } from './ai-center.types';
import { CreateProviderDialog } from './CreateProviderDialog';
import { EditProviderDialog } from './EditProviderDialog';

const API_TYPE_LABELS: Record<string, string> = {
  openai_compatible: 'OpenAI API',
  anthropic: 'Anthropic',
};

export function AiProviders() {
  const { data: providers = [], isLoading } = useAiProviders();
  const toggleMutation = useToggleAiProvider();
  const deleteMutation = useDeleteAiProvider();
  const setDefaultMutation = useSetDefaultAiProvider();
  const testMutation = useTestAiProvider();

  const [showCreate, setShowCreate] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AiProvider | null>(
    null
  );
  const [testResults, setTestResults] = useState<
    Record<string, AiProviderTestResult>
  >({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, string>>({});
  const [loadingKeyId, setLoadingKeyId] = useState<string | null>(null);

  const handleTest = (provider: AiProvider) => {
    setTestingId(provider.id);
    testMutation.mutate(provider.id, {
      onSuccess: result => {
        setTestResults(prev => ({ ...prev, [provider.id]: result }));
        setTestingId(null);
      },
      onError: () => {
        setTestResults(prev => ({
          ...prev,
          [provider.id]: {
            success: false,
            latencyMs: 0,
            modelResponse: null,
            error: 'Ошибка сети',
          },
        }));
        setTestingId(null);
      },
    });
  };

  const handleToggleKey = async (provider: AiProvider) => {
    if (revealedKeys[provider.id]) {
      setRevealedKeys(prev => {
        const next = { ...prev };
        delete next[provider.id];
        return next;
      });
      return;
    }
    setLoadingKeyId(provider.id);
    try {
      const key = await getAiProviderKey(provider.id);
      setRevealedKeys(prev => ({ ...prev, [provider.id]: key }));
    } catch {
      // ignore
    } finally {
      setLoadingKeyId(null);
    }
  };

  const handleDelete = (provider: AiProvider) => {
    if (!confirm(`Удалить провайдер "${provider.name}"?`)) return;
    deleteMutation.mutate(provider.id);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Заголовок */}
      <div className='flex items-center justify-between px-6 py-4 border-b'>
        <div>
          <h2 className='text-lg font-semibold'>Провайдеры</h2>
          <p className='text-sm text-muted-foreground'>
            Подключения к LLM: API-ключи, модели, хосты
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} size='sm'>
          <Plus className='h-4 w-4 mr-1.5' />
          Добавить
        </Button>
      </div>

      {/* Список */}
      <ScrollArea className='flex-1'>
        <div className='p-6 space-y-3'>
          {providers.length === 0 && (
            <div className='text-center py-16 text-muted-foreground'>
              <Network className='h-12 w-12 mx-auto mb-3 opacity-30' />
              <p className='text-sm'>Нет подключённых провайдеров</p>
              <Button
                variant='outline'
                size='sm'
                className='mt-3'
                onClick={() => setShowCreate(true)}
              >
                <Plus className='h-4 w-4 mr-1.5' />
                Добавить первый
              </Button>
            </div>
          )}

          {providers.map(provider => {
            const testResult = testResults[provider.id];
            const isTesting = testingId === provider.id;

            return (
              <div
                key={provider.id}
                className='flex items-center gap-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors'
              >
                {/* Основная информация */}
                <div className='flex-1 min-w-0 overflow-hidden'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium truncate'>
                      {provider.name}
                    </span>
                    {provider.isDefault && (
                      <Badge variant='secondary' className='text-xs gap-1'>
                        <Star className='h-3 w-3' />
                        По умолчанию
                      </Badge>
                    )}
                    <Badge variant='outline' className='text-xs'>
                      {API_TYPE_LABELS[provider.apiType] ?? provider.apiType}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-3 text-xs text-muted-foreground mt-1 min-w-0'>
                    <span className='font-mono shrink-0'>
                      {provider.modelName}
                    </span>
                    <button
                      className='flex items-center gap-1 font-mono opacity-60 hover:opacity-100 transition-opacity min-w-0 max-w-[200px]'
                      onClick={() => handleToggleKey(provider)}
                      title={
                        revealedKeys[provider.id]
                          ? 'Скрыть ключ'
                          : 'Показать ключ'
                      }
                    >
                      {loadingKeyId === provider.id ? (
                        <Loader2 className='h-3 w-3 animate-spin shrink-0' />
                      ) : revealedKeys[provider.id] ? (
                        <EyeOff className='h-3 w-3 shrink-0' />
                      ) : (
                        <Eye className='h-3 w-3 shrink-0' />
                      )}
                      <span className='select-all truncate'>
                        {revealedKeys[provider.id] ?? provider.apiKeyPrefix}
                      </span>
                    </button>
                    {provider.baseUrl && (
                      <span className='truncate max-w-[200px] shrink-0'>
                        {provider.baseUrl}
                      </span>
                    )}
                  </div>

                  {/* Результат теста */}
                  {testResult && (
                    <div className='flex items-center gap-2 mt-1.5'>
                      {testResult.success ? (
                        <span className='flex items-center gap-1 text-xs text-green-600'>
                          <CheckCircle2 className='h-3.5 w-3.5' />
                          {testResult.latencyMs}ms
                          {testResult.modelResponse && (
                            <span className='opacity-60 ml-1'>
                              &mdash; {testResult.modelResponse}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className='flex items-center gap-1 text-xs text-red-600'>
                          <XCircle className='h-3.5 w-3.5' />
                          {testResult.error}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Действия */}
                <div className='flex items-center gap-2 shrink-0'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    title='Проверить подключение'
                    onClick={() => handleTest(provider)}
                    disabled={isTesting}
                  >
                    {isTesting ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Zap className='h-4 w-4' />
                    )}
                  </Button>

                  {!provider.isDefault && provider.isActive && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      title='Сделать основным'
                      onClick={() => setDefaultMutation.mutate(provider.id)}
                    >
                      <Star className='h-4 w-4' />
                    </Button>
                  )}

                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    title='Редактировать'
                    onClick={() => setEditingProvider(provider)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>

                  <Switch
                    checked={provider.isActive}
                    onCheckedChange={() => toggleMutation.mutate(provider.id)}
                    disabled={provider.isDefault && provider.isActive}
                  />

                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-destructive'
                    title='Удалить'
                    onClick={() => handleDelete(provider)}
                    disabled={provider.isDefault}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Диалоги */}
      {showCreate && (
        <CreateProviderDialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
        />
      )}

      {editingProvider && (
        <EditProviderDialog
          open={!!editingProvider}
          provider={editingProvider}
          onClose={() => setEditingProvider(null)}
        />
      )}
    </div>
  );
}
