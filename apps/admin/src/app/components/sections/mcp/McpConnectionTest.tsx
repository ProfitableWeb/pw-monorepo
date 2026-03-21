import { Wifi, WifiOff, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { cn } from '@/app/components/ui/utils';
import { useMcpConnectionTest } from '@/hooks/api';

export function McpConnectionTest() {
  const {
    mutate,
    data: status,
    isPending,
    isError,
    error,
    isIdle,
  } = useMcpConnectionTest();

  const handleTest = () => {
    mutate();
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
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <RefreshCw className='h-4 w-4' />
          )}
          {isPending ? 'Проверка...' : 'Проверить'}
        </Button>
      </CardHeader>
      <CardContent>
        {isIdle && (
          <p className='text-sm text-muted-foreground'>
            Нажмите «Проверить» чтобы убедиться, что MCP-сервер доступен и
            отвечает.
          </p>
        )}

        {isPending && (
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Подключение к MCP-серверу...
          </div>
        )}

        {status && !isPending && (
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
                    {status.toolCount} tools
                  </p>
                </>
              ) : (
                <>
                  <p className='text-sm font-medium text-red-500'>
                    Сервер недоступен
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {isError && !isPending && (
          <div className='flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/5 p-3'>
            <WifiOff className='h-5 w-5 text-red-500 shrink-0' />
            <div>
              <p className='text-sm font-medium text-red-500'>Ошибка</p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {error?.message || 'Не удалось выполнить проверку'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
