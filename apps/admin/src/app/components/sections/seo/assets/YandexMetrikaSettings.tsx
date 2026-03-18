import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  Link2,
  Unlink,
  Users,
  MousePointerClick,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Loader2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { cn } from '@/app/components/ui/utils';
import { LoadingSpinner } from '@/app/components/common';
import { MOCK_METRIKA_CONFIG } from '../seo.constants';
import type { SeoSettings, YandexConnectionStatus } from '@/lib/api-client';
import {
  getYandexAuthUrl,
  connectYandex,
  disconnectYandex,
  getMetrikaStats,
  type MetrikaStatsData,
} from '@/lib/api-client';

interface YandexMetrikaSettingsProps {
  initialData?: SeoSettings | null;
  onDataChange: (update: Partial<SeoSettings>) => void;
  /** Статус подключения Yandex OAuth (поднят в SeoPage для переиспользования) */
  connection: YandexConnectionStatus | null;
  onConnectionChange: (status: YandexConnectionStatus) => void;
}

/** Форматирование секунд в MM:SS */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Форматирование изменения: +12.5% / -3.2% */
function formatChange(value: number): string {
  return `${value > 0 ? '+' : ''}${value}%`;
}

export function YandexMetrikaSettings({
  initialData,
  onDataChange,
  connection,
  onConnectionChange,
}: YandexMetrikaSettingsProps) {
  const mc = initialData?.metrikaConfig ?? MOCK_METRIKA_CONFIG;
  const [counterId, setCounterId] = useState(mc.counterId);
  const [clickmap, setClickmap] = useState(mc.clickmap);
  const [trackLinks, setTrackLinks] = useState(mc.trackLinks);
  const [accurateTrackBounce, setAccurateTrackBounce] = useState(
    mc.accurateTrackBounce
  );
  const [webvisor, setWebvisor] = useState(mc.webvisor);
  const [trackHash, setTrackHash] = useState(mc.trackHash);

  /** Ref с актуальным состоянием Метрики — решает проблему stale closure в handleToggle */
  const metrikaRef = useRef({
    counterId,
    clickmap,
    trackLinks,
    accurateTrackBounce,
    webvisor,
    trackHash,
  });
  metrikaRef.current = {
    counterId,
    clickmap,
    trackLinks,
    accurateTrackBounce,
    webvisor,
    trackHash,
  };

  // --- OAuth UI state ---
  const [isConnecting, setIsConnecting] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  // --- Metrika Stats ---
  const [stats, setStats] = useState<MetrikaStatsData | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [period, setPeriod] = useState('30d');

  const isConnected = connection?.connected ?? false;

  // Загрузка статистики при подключённом состоянии
  const loadStats = useCallback((p: string) => {
    setIsLoadingStats(true);
    getMetrikaStats(p)
      .then(setStats)
      .catch(err => console.error('Ошибка загрузки статистики Метрики:', err))
      .finally(() => setIsLoadingStats(false));
  }, []);

  useEffect(() => {
    if (isConnected && counterId) {
      loadStats(period);
    }
  }, [isConnected, counterId, period, loadStats]);

  /** Подключение через код авторизации */
  const handleConnect = async () => {
    if (!authCode.trim()) return;
    setIsConnecting(true);
    try {
      const status = await connectYandex(authCode.trim());
      onConnectionChange(status);
      setAuthCode('');
      setShowCodeInput(false);
    } catch (err) {
      console.error('Ошибка подключения:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  /** Открытие страницы авторизации */
  const handleOpenAuth = async () => {
    try {
      const url = await getYandexAuthUrl();
      window.open(url, '_blank');
      setShowCodeInput(true);
    } catch (err) {
      console.error('Ошибка получения URL авторизации:', err);
    }
  };

  /** Отключение OAuth */
  const handleDisconnect = async () => {
    try {
      const status = await disconnectYandex();
      onConnectionChange(status);
      setStats(null);
    } catch (err) {
      console.error('Ошибка отключения:', err);
    }
  };

  /** Обновляет булевый параметр Метрики и уведомляет оркестратор */
  const handleToggle =
    (setter: (v: boolean) => void, field: string) => (checked: boolean) => {
      setter(checked);
      onDataChange({
        metrikaConfig: {
          ...metrikaRef.current,
          [field]: checked,
        },
      });
    };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Яндекс.Метрика</h2>
        <p className='text-muted-foreground'>
          Счётчик посещаемости и аналитика
        </p>
      </div>

      {/* Card 1: Счётчик */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Счётчик Яндекс.Метрики</CardTitle>
          </div>
          <Badge
            variant={counterId ? 'default' : 'secondary'}
            className={cn(
              counterId
                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
            )}
          >
            {counterId ? 'Подключён' : 'Не настроен'}
          </Badge>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='counter-id'>Номер счётчика</Label>
            <Input
              id='counter-id'
              placeholder='Например, 96399096'
              value={counterId}
              onChange={e => {
                setCounterId(e.target.value);
                onDataChange({
                  metrikaConfig: {
                    ...metrikaRef.current,
                    counterId: e.target.value,
                  },
                });
              }}
            />
          </div>

          <div className='space-y-3'>
            <p className='text-sm font-medium'>Параметры отслеживания</p>
            <div className='space-y-3'>
              {[
                {
                  label: 'Карта кликов (clickmap)',
                  checked: clickmap,
                  setter: setClickmap,
                  field: 'clickmap',
                },
                {
                  label: 'Отслеживание ссылок (trackLinks)',
                  checked: trackLinks,
                  setter: setTrackLinks,
                  field: 'trackLinks',
                },
                {
                  label: 'Точный подсчёт отказов (accurateTrackBounce)',
                  checked: accurateTrackBounce,
                  setter: setAccurateTrackBounce,
                  field: 'accurateTrackBounce',
                },
                {
                  label: 'Вебвизор (webvisor)',
                  checked: webvisor,
                  setter: setWebvisor,
                  field: 'webvisor',
                },
                {
                  label: 'Отслеживание hash (trackHash)',
                  checked: trackHash,
                  setter: setTrackHash,
                  field: 'trackHash',
                },
              ].map(item => (
                <div
                  key={item.label}
                  className='flex items-center justify-between'
                >
                  <Label className='font-normal'>{item.label}</Label>
                  <Switch
                    checked={item.checked}
                    onCheckedChange={handleToggle(item.setter, item.field)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button variant='outline' asChild>
            <a
              href='https://metrika.yandex.ru'
              target='_blank'
              rel='noopener noreferrer'
            >
              <ExternalLink className='mr-2 h-4 w-4' />
              Открыть Яндекс.Метрику
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Card 2: Подключение к Яндекс API */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Подключение к Яндекс API</CardTitle>
          </div>
          {isConnected && (
            <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
              Активно
            </Badge>
          )}
        </CardHeader>
        <CardContent className='space-y-4'>
          {isConnected ? (
            <>
              <div className='space-y-2 text-sm'>
                <p>
                  Аккаунт:{' '}
                  <span className='font-medium'>
                    {connection?.account ?? '—'}
                  </span>
                </p>
                {connection?.permissions && (
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span>Права:</span>
                    {connection.permissions.map(perm => (
                      <Badge key={perm} variant='secondary'>
                        {perm}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm' onClick={handleOpenAuth}>
                  <Link2 className='mr-2 h-4 w-4' />
                  Переподключить
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-destructive hover:text-destructive'
                  onClick={handleDisconnect}
                >
                  <Unlink className='mr-2 h-4 w-4' />
                  Отключить
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className='rounded-md bg-yellow-50 border border-yellow-200 p-4 space-y-2'>
                <p className='text-sm font-medium text-yellow-800'>
                  Яндекс API не подключён
                </p>
                <p className='text-sm text-yellow-700'>
                  Подключите для отображения статистики посещаемости и данных
                  индексации
                </p>
              </div>
              <Button onClick={handleOpenAuth}>
                <Link2 className='mr-2 h-4 w-4' />
                Подключить Яндекс API
              </Button>

              {showCodeInput && (
                <div className='space-y-3 rounded-md border p-4'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>
                      Вставьте код авторизации
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Авторизуйте приложение на открывшейся странице Яндекса,
                      скопируйте код и вставьте сюда
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    <Input
                      placeholder='Код авторизации'
                      value={authCode}
                      onChange={e => setAuthCode(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleConnect()}
                    />
                    <Button
                      size='sm'
                      onClick={handleConnect}
                      disabled={isConnecting || !authCode.trim()}
                    >
                      {isConnecting ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        'Подключить'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Card 3: Статистика посещаемости */}
      {isConnected && counterId ? (
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Статистика посещаемости</CardTitle>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger size='sm' className='w-[120px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1d'>1 день</SelectItem>
                <SelectItem value='7d'>7 дней</SelectItem>
                <SelectItem value='30d'>30 дней</SelectItem>
                <SelectItem value='90d'>90 дней</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className='space-y-4'>
            {isLoadingStats ? (
              <LoadingSpinner />
            ) : stats ? (
              <>
                <div className='grid grid-cols-4 gap-4'>
                  {[
                    {
                      label: 'Посетителей',
                      value: Math.round(stats.visitors.value).toLocaleString(
                        'ru-RU'
                      ),
                      change: formatChange(stats.visitors.change),
                      positive: stats.visitors.change >= 0,
                      icon: Users,
                    },
                    {
                      label: 'Просмотров',
                      value: Math.round(stats.pageviews.value).toLocaleString(
                        'ru-RU'
                      ),
                      change: formatChange(stats.pageviews.change),
                      positive: stats.pageviews.change >= 0,
                      icon: MousePointerClick,
                    },
                    {
                      label: 'Стр/визит',
                      value: stats.pageDepth.value.toFixed(1),
                      change: formatChange(stats.pageDepth.change),
                      positive: stats.pageDepth.change >= 0,
                      icon: BarChart3,
                    },
                    {
                      label: 'Время',
                      value: formatDuration(stats.avgDuration.value),
                      change: formatChange(stats.avgDuration.change),
                      positive: stats.avgDuration.change >= 0,
                      icon: Clock,
                    },
                  ].map(metric => (
                    <div
                      key={metric.label}
                      className='rounded-lg border p-3 space-y-1'
                    >
                      <div className='flex items-center justify-between'>
                        <metric.icon className='h-4 w-4 text-muted-foreground' />
                        <span
                          className={cn(
                            'text-xs font-medium flex items-center gap-0.5',
                            metric.positive ? 'text-green-600' : 'text-red-600'
                          )}
                        >
                          {metric.positive ? (
                            <TrendingUp className='h-3 w-3' />
                          ) : (
                            <TrendingDown className='h-3 w-3' />
                          )}
                          {metric.change}
                        </span>
                      </div>
                      <p className='text-2xl font-bold'>{metric.value}</p>
                      <p className='text-xs text-muted-foreground'>
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>

                {stats.dailyVisits.length > 0 && (
                  <div className='flex items-end gap-0.5 h-16'>
                    {(() => {
                      const max = Math.max(...stats.dailyVisits);
                      return stats.dailyVisits.map((visits, i) => {
                        const height = max > 0 ? (visits / max) * 100 : 0;
                        return (
                          <div
                            key={i}
                            className='flex-1 bg-muted-foreground/20 rounded-t'
                            style={{ height: `${height}%` }}
                          />
                        );
                      });
                    })()}
                  </div>
                )}

                <p className='text-sm text-muted-foreground'>
                  Отказы: {stats.bounceRate.value.toFixed(1)}%{' '}
                  <span
                    className={
                      stats.bounceRate.change <= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    ({stats.bounceRate.change <= 0 ? '↓' : '↑'}{' '}
                    {Math.abs(stats.bounceRate.change)}%)
                  </span>
                </p>
              </>
            ) : (
              <p className='text-sm text-muted-foreground py-4 text-center'>
                Нет данных за выбранный период
              </p>
            )}

            <Button variant='outline' asChild>
              <a
                href='https://metrika.yandex.ru'
                target='_blank'
                rel='noopener noreferrer'
              >
                <ExternalLink className='mr-2 h-4 w-4' />
                Подробнее в Яндекс.Метрике
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className='border-dashed'>
          <CardContent className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
            <BarChart3 className='h-12 w-12 mb-4' />
            <p className='text-sm'>
              {!counterId
                ? 'Укажите номер счётчика для отображения статистики'
                : 'Подключите Яндекс API для отображения статистики'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
