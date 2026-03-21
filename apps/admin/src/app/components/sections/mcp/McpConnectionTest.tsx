import { useState } from 'react';
import { Wifi, WifiOff, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { cn } from '@/app/components/ui/utils';
import type { McpConnectionStatus } from './mcp.types';

type TestState = 'idle' | 'loading' | 'success' | 'error';

// Mock: simulate connection check
const MOCK_STATUS: McpConnectionStatus = {
  available: true,
  toolCount: 29,
  version: '1.0.0',
};

export function McpConnectionTest() {
  const [state, setState] = useState<TestState>('idle');
  const [status, setStatus] = useState<McpConnectionStatus | null>(null);

  const handleTest = async () => {
    setState('loading');
    setStatus(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // TODO: заменить на реальный вызов API (PW-061-C)
      setStatus(MOCK_STATUS);
      setState('success');
    } catch {
      setState('error');
    }
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <CardTitle className='text-base'>Проверить подключение</CardTitle>
        <Button
          size='sm'
          variant='outline'
          className='gap-1.5'
          onClick={handleTest}
          disabled={state === 'loading'}
        >
          {state === 'loading' ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <RefreshCw className='h-4 w-4' />
          )}
          {state === 'loading' ? 'Проверка...' : 'Проверить'}
        </Button>
      </CardHeader>
      <CardContent>
        {state === 'idle' && (
          <p className='text-sm text-muted-foreground'>
            Нажмите «Проверить» чтобы убедиться, что MCP-сервер доступен и
            отвечает.
          </p>
        )}

        {state === 'loading' && (
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Подключение к MCP-серверу...
          </div>
        )}

        {state === 'success' && status && (
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg border p-3',
              status.available
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-red-500/30 bg-red-500/5'
            )}
          >
            {status.available ? (
              <Wifi className='h-5 w-5 text-green-500 shrink-0' />
            ) : (
              <WifiOff className='h-5 w-5 text-red-500 shrink-0' />
            )}
            <div className='flex-1 min-w-0'>
              {status.available ? (
                <>
                  <p className='text-sm font-medium text-green-500'>
                    Сервер доступен
                  </p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    {status.toolCount} tools, версия {status.version}
                  </p>
                </>
              ) : (
                <>
                  <p className='text-sm font-medium text-red-500'>
                    Ошибка подключения
                  </p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    {status.error || 'Сервер не отвечает'}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className='flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/5 p-3'>
            <WifiOff className='h-5 w-5 text-red-500 shrink-0' />
            <div>
              <p className='text-sm font-medium text-red-500'>Ошибка</p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Не удалось выполнить проверку
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
