/**
 * PW-042-D2 | Таб «Система» — здоровье сервера, ресурсы, сервисы, версии.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import {
  Activity,
  Clock,
  Cpu,
  Database,
  HardDrive,
  MemoryStick,
  RefreshCw,
  Server,
} from 'lucide-react';
import type { SystemHealth, ServiceStatus } from '../monitoring.types';

interface SystemTabProps {
  health: SystemHealth;
  loading: boolean;
  onRefresh: () => void;
}

/** Форматирование uptime в человекочитаемый вид */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} дн`);
  if (hours > 0) parts.push(`${hours} ч`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} мин`);
  return parts.join(' ');
}

/** Цвет прогресс-бара по порогам */
function usageColor(percent: number): string {
  if (percent >= 90) return 'text-red-500';
  if (percent >= 70) return 'text-amber-500';
  return 'text-emerald-500';
}

function progressIndicator(percent: number): string {
  if (percent >= 90) return '[&>[data-slot=progress-indicator]]:bg-red-500';
  if (percent >= 70) return '[&>[data-slot=progress-indicator]]:bg-amber-500';
  return '[&>[data-slot=progress-indicator]]:bg-emerald-500';
}

/** Иконка сервиса */
function serviceIcon(name: ServiceStatus['name']) {
  switch (name) {
    case 'api':
      return <Server className='size-4' />;
    case 'db':
      return <Database className='size-4' />;
    case 'storage':
      return <HardDrive className='size-4' />;
  }
}

/** Русское название сервиса */
function serviceName(name: ServiceStatus['name']): string {
  switch (name) {
    case 'api':
      return 'API';
    case 'db':
      return 'База данных';
    case 'storage':
      return 'Хранилище';
  }
}

/** Статус-бэдж (как в StorageSettings) */
function statusBadge(overall: SystemHealth['status']) {
  const config = {
    ok: {
      label: 'Всё в порядке',
      dot: 'bg-emerald-500',
      className:
        'bg-emerald-500/15 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/15',
    },
    degraded: {
      label: 'Деградация',
      dot: 'bg-amber-500',
      className:
        'bg-amber-500/15 text-amber-600 border-amber-500/25 hover:bg-amber-500/15',
    },
    down: {
      label: 'Недоступен',
      dot: 'bg-red-500',
      className: '',
    },
  };
  const c = config[overall];
  return (
    <Badge
      variant={overall === 'down' ? 'destructive' : 'default'}
      className={c.className}
    >
      <span className={`size-1.5 rounded-full mr-1.5 ${c.dot}`} />
      {c.label}
    </Badge>
  );
}

export function SystemTab({ health, loading, onRefresh }: SystemTabProps) {
  return (
    <ScrollArea className='flex-1 min-h-0 border rounded-lg'>
      <div className='p-4 space-y-6'>
        {/* Статус + обновление */}
        <Card>
          <CardHeader className='pb-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='p-2.5 rounded-lg bg-muted/50'>
                  <Activity className='size-5 text-muted-foreground' />
                </div>
                <div>
                  <CardTitle className='text-lg'>Состояние системы</CardTitle>
                  <CardDescription className='text-xs'>
                    Работает непрерывно: {formatUptime(health.uptimeSeconds)}
                  </CardDescription>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                {statusBadge(health.status)}
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={onRefresh}
                  disabled={loading}
                  className='size-8'
                  aria-label='Обновить данные'
                >
                  <RefreshCw
                    className={`size-4 ${loading ? 'animate-spin' : ''}`}
                  />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Ресурсы: CPU, память, диск */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Cpu className='size-4' />
              Ресурсы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              {/* CPU */}
              <div className='space-y-2 p-3 rounded-lg bg-muted/50'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>CPU</span>
                  <span
                    className={`text-sm font-mono font-medium ${usageColor(health.cpuPercent)}`}
                  >
                    {health.cpuPercent.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={health.cpuPercent}
                  className={`h-2 ${progressIndicator(health.cpuPercent)}`}
                />
              </div>

              {/* Память */}
              <div className='space-y-2 p-3 rounded-lg bg-muted/50'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium flex items-center gap-1'>
                    <MemoryStick className='size-3' />
                    Память
                  </span>
                  <span
                    className={`text-sm font-mono font-medium ${usageColor(health.memory.percent)}`}
                  >
                    {health.memory.percent.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={health.memory.percent}
                  className={`h-2 ${progressIndicator(health.memory.percent)}`}
                />
                <p className='text-xs text-muted-foreground'>
                  {health.memory.usedGb.toFixed(1)} /{' '}
                  {health.memory.totalGb.toFixed(1)} ГБ
                </p>
              </div>

              {/* Диск */}
              <div className='space-y-2 p-3 rounded-lg bg-muted/50'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium flex items-center gap-1'>
                    <HardDrive className='size-3' />
                    Диск
                  </span>
                  <span
                    className={`text-sm font-mono font-medium ${usageColor(health.disk.percent)}`}
                  >
                    {health.disk.percent.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={health.disk.percent}
                  className={`h-2 ${progressIndicator(health.disk.percent)}`}
                />
                <p className='text-xs text-muted-foreground'>
                  {health.disk.usedGb.toFixed(1)} /{' '}
                  {health.disk.totalGb.toFixed(1)} ГБ
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Сервисы */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Server className='size-4' />
              Сервисы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='divide-y divide-border'>
              {health.services.map(svc => (
                <div
                  key={svc.name}
                  className='flex items-center justify-between py-3'
                >
                  <div className='flex items-center gap-3'>
                    <div className='p-1.5 rounded bg-muted/50'>
                      {serviceIcon(svc.name)}
                    </div>
                    <span className='text-sm font-medium'>
                      {serviceName(svc.name)}
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    {svc.latencyMs !== null && (
                      <span className='text-xs font-mono text-muted-foreground'>
                        {svc.latencyMs} ms
                      </span>
                    )}
                    <Badge
                      variant={svc.connected ? 'default' : 'destructive'}
                      className={
                        svc.connected
                          ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/15'
                          : ''
                      }
                    >
                      <span
                        className={`size-1.5 rounded-full mr-1.5 ${
                          svc.connected ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      {svc.connected ? 'Подключён' : 'Отключён'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Версии */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Clock className='size-4' />
              Информация
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='divide-y divide-border'>
              <div className='flex items-center justify-between py-2'>
                <span className='text-sm text-muted-foreground'>
                  Версия бэкенда
                </span>
                <code className='text-sm bg-muted px-2 py-0.5 rounded font-mono'>
                  {health.version}
                </code>
              </div>
              <div className='flex items-center justify-between py-2'>
                <span className='text-sm text-muted-foreground'>Python</span>
                <code className='text-sm bg-muted px-2 py-0.5 rounded font-mono'>
                  {health.pythonVersion}
                </code>
              </div>
              <div className='flex items-center justify-between py-2'>
                <span className='text-sm text-muted-foreground'>
                  Ошибок за 24ч
                </span>
                <Badge
                  variant={health.errors24h > 0 ? 'destructive' : 'default'}
                  className={
                    health.errors24h === 0
                      ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/15'
                      : ''
                  }
                >
                  {health.errors24h}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
