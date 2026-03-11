/**
 * PW-041-D1 | Таб «Обзор» — бэкенд, конфигурация, статус подключения.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Cloud,
  HardDrive,
  Server,
  Upload,
  RefreshCw,
  ArrowLeftRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Image,
  File,
} from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';
import { Button } from '@/app/components/ui/button';
import type { StorageInfo } from '../storage.types';

interface OverviewTabProps {
  info: StorageInfo;
  onRefresh: () => void;
  loading: boolean;
  syncing: boolean;
  onSync: () => void;
}

function ConfigRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className='flex items-center justify-between py-2'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <code className='text-sm bg-muted px-2 py-0.5 rounded font-mono'>
        {value}
      </code>
    </div>
  );
}

function formatSyncDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OverviewTab({
  info,
  onRefresh,
  loading,
  syncing,
  onSync,
}: OverviewTabProps) {
  const isS3 = info.backend === 's3';
  const { sync } = info;
  const total = sync.localOnly + sync.s3Only + sync.synced;
  const needsSync = sync.localOnly > 0 || sync.s3Only > 0;
  const syncPercent = total > 0 ? Math.round((sync.synced / total) * 100) : 100;

  return (
    <div className='space-y-6'>
      {/* Бэкенд и статус */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2.5 rounded-lg bg-muted/50'>
                {isS3 ? (
                  <Cloud className='size-5 text-muted-foreground' />
                ) : (
                  <HardDrive className='size-5 text-muted-foreground' />
                )}
              </div>
              <div>
                <CardTitle className='text-lg'>
                  {isS3 ? 'S3 Cloud.ru' : 'Локальный диск'}
                </CardTitle>
                <CardDescription>
                  {isS3
                    ? 'Cloud.ru Evolution Object Storage'
                    : 'Файлы на VM, раздача через nginx'}
                </CardDescription>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Badge
                variant={info.health.connected ? 'default' : 'destructive'}
                className={
                  info.health.connected
                    ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/15'
                    : ''
                }
              >
                <span
                  className={`size-1.5 rounded-full mr-1.5 ${
                    info.health.connected ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
                {info.health.connected ? 'Подключено' : 'Нет соединения'}
              </Badge>
              <Button
                variant='ghost'
                size='icon'
                onClick={onRefresh}
                disabled={loading}
                className='size-8'
              >
                <RefreshCw
                  className={`size-4 ${loading ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        {(info.health.latencyMs !== null || info.health.error) && (
          <CardContent className='pt-0'>
            {info.health.latencyMs !== null && (
              <p className='text-sm text-muted-foreground'>
                Время отклика:{' '}
                <span className='font-mono font-medium text-foreground'>
                  {info.health.latencyMs} ms
                </span>
              </p>
            )}
            {info.health.error && (
              <p className='text-sm text-red-500 mt-1'>{info.health.error}</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Конфигурация */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Server className='size-4' />
            Конфигурация
          </CardTitle>
          <CardDescription>
            Текущие параметры хранилища (из переменных окружения)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='divide-y divide-border'>
            {isS3 ? (
              <>
                <ConfigRow label='Бакет' value={info.config.bucket} />
                <ConfigRow label='Регион' value={info.config.region} />
                <ConfigRow label='API endpoint' value={info.config.endpoint} />
                <ConfigRow
                  label='Публичный endpoint'
                  value={info.config.publicEndpoint}
                />
              </>
            ) : (
              <ConfigRow label='Путь на диске' value={info.config.uploadDir} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Лимиты загрузки (read-only из env) */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Upload className='size-4' />
            Лимиты загрузки
          </CardTitle>
          <CardDescription>
            Максимальный размер файлов при загрузке (настраивается через
            переменные окружения)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex items-center justify-between p-3 rounded-lg bg-muted/50'>
              <div className='flex items-center gap-2'>
                <Image className='size-4 text-muted-foreground' />
                <span className='text-sm font-medium'>Изображения</span>
              </div>
              <span className='text-sm font-mono font-medium'>
                {info.config.maxUploadImageMb} МБ
              </span>
            </div>
            <div className='flex items-center justify-between p-3 rounded-lg bg-muted/50'>
              <div className='flex items-center gap-2'>
                <File className='size-4 text-muted-foreground' />
                <span className='text-sm font-medium'>Прочие файлы</span>
              </div>
              <span className='text-sm font-mono font-medium'>
                {info.config.maxUploadOtherMb} МБ
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Синхронизация файлов */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-lg flex items-center gap-2'>
                <ArrowLeftRight className='size-4' />
                Синхронизация файлов
              </CardTitle>
              <CardDescription>
                Расположение медиафайлов по хранилищам
              </CardDescription>
            </div>
            <Button
              variant={needsSync ? 'default' : 'outline'}
              size='sm'
              onClick={onSync}
              disabled={syncing || total === 0}
            >
              {syncing ? (
                <>
                  <Loader2 className='size-4 mr-2 animate-spin' />
                  Синхронизация...
                </>
              ) : (
                <>
                  <ArrowLeftRight className='size-4 mr-2' />
                  Синхронизировать
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {total === 0 ? (
            <p className='text-sm text-muted-foreground text-center py-4'>
              Нет файлов для синхронизации
            </p>
          ) : (
            <div className='space-y-4'>
              {/* Прогресс-бар */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>
                    Синхронизировано
                  </span>
                  <span className='font-mono font-medium'>
                    {sync.synced} из {total} ({syncPercent}%)
                  </span>
                </div>
                <Progress value={syncPercent} className='h-2' />
              </div>

              {/* Разбивка по хранилищам */}
              <div className='grid grid-cols-3 gap-3'>
                <div className='p-3 rounded-lg bg-muted/50 text-center'>
                  <p className='text-lg font-semibold'>{sync.localOnly}</p>
                  <p className='text-xs text-muted-foreground'>
                    Только на диске
                  </p>
                </div>
                <div className='p-3 rounded-lg bg-muted/50 text-center'>
                  <p className='text-lg font-semibold'>{sync.s3Only}</p>
                  <p className='text-xs text-muted-foreground'>Только в S3</p>
                </div>
                <div className='p-3 rounded-lg bg-muted/50 text-center'>
                  <p className='text-lg font-semibold'>{sync.synced}</p>
                  <p className='text-xs text-muted-foreground'>В обоих</p>
                </div>
              </div>

              {/* Предупреждение или статус */}
              {needsSync ? (
                <div className='flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20'>
                  <AlertTriangle className='size-4 text-amber-500 mt-0.5 flex-shrink-0' />
                  <p className='text-sm text-amber-600 dark:text-amber-400'>
                    {sync.localOnly > 0 &&
                      `${sync.localOnly} файл(ов) только на диске. `}
                    {sync.s3Only > 0 && `${sync.s3Only} файл(ов) только в S3. `}
                    Запустите синхронизацию для копирования в оба хранилища.
                  </p>
                </div>
              ) : (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <CheckCircle2 className='size-4 text-emerald-500' />
                  Все файлы синхронизированы
                </div>
              )}

              {/* Последняя синхронизация */}
              {sync.lastSyncAt && (
                <p className='text-xs text-muted-foreground'>
                  Последняя синхронизация:{' '}
                  <span className='font-medium text-foreground'>
                    {formatSyncDate(sync.lastSyncAt)}
                  </span>
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
