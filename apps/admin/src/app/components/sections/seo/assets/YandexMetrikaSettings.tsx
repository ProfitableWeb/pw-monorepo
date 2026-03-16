import { useState } from 'react';
import {
  ExternalLink,
  Eye,
  EyeOff,
  Link2,
  Unlink,
  ChevronDown,
  Users,
  MousePointerClick,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible';
import { cn } from '@/app/components/ui/utils';
import {
  MOCK_METRIKA_CONFIG,
  MOCK_YANDEX_API_CONNECTION,
  MOCK_METRIKA_STATS,
} from '../seo.constants';
import type { SeoSettings } from '@/lib/api-client';

interface YandexMetrikaSettingsProps {
  initialData?: SeoSettings | null;
  onDataChange: (update: Partial<SeoSettings>) => void;
}

export function YandexMetrikaSettings({
  initialData,
  onDataChange,
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

  const [isConnected, setIsConnected] = useState(
    MOCK_YANDEX_API_CONNECTION.connected
  );
  const [showToken, setShowToken] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [tokenOpen, setTokenOpen] = useState(false);
  const [period, setPeriod] = useState('30');

  /** Обновляет булевый параметр Метрики и уведомляет оркестратор */
  const handleToggle =
    (setter: (v: boolean) => void, field: string) => (checked: boolean) => {
      setter(checked);
      onDataChange({
        metrikaConfig: {
          counterId,
          clickmap,
          trackLinks,
          accurateTrackBounce,
          webvisor,
          trackHash,
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
              placeholder='Например, 12345678'
              value={counterId}
              onChange={e => {
                setCounterId(e.target.value);
                onDataChange({
                  metrikaConfig: {
                    counterId: e.target.value,
                    clickmap,
                    trackLinks,
                    accurateTrackBounce,
                    webvisor,
                    trackHash,
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
                    {MOCK_YANDEX_API_CONNECTION.account}
                  </span>
                </p>
                <div className='flex items-center gap-2 flex-wrap'>
                  <span>Права:</span>
                  {MOCK_YANDEX_API_CONNECTION.permissions.map(perm => (
                    <Badge key={perm} variant='secondary'>
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm'>
                  <Link2 className='mr-2 h-4 w-4' />
                  Переподключить
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-destructive hover:text-destructive'
                  onClick={() => setIsConnected(false)}
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
              <Button onClick={() => setIsConnected(true)}>
                <Link2 className='mr-2 h-4 w-4' />
                Подключить Яндекс API
              </Button>
              <Collapsible open={tokenOpen} onOpenChange={setTokenOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant='ghost' size='sm' className='gap-1'>
                    Вставить токен вручную
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        tokenOpen && 'rotate-180'
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className='space-y-2 pt-2'>
                  <div className='flex gap-2'>
                    <div className='relative flex-1'>
                      <Input
                        type={showToken ? 'text' : 'password'}
                        placeholder='OAuth-токен'
                        value={manualToken}
                        onChange={e => setManualToken(e.target.value)}
                      />
                      <Button
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3'
                        onClick={() => setShowToken(!showToken)}
                      >
                        {showToken ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                    <Button
                      size='sm'
                      onClick={() => {
                        setIsConnected(true);
                      }}
                    >
                      Сохранить
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
        </CardContent>
      </Card>

      {/* Card 3: Статистика посещаемости */}
      {isConnected ? (
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Статистика посещаемости</CardTitle>
            <select
              className='rounded-md border bg-background px-3 py-1.5 text-sm'
              value={period}
              onChange={e => setPeriod(e.target.value)}
            >
              <option value='7'>7 дней</option>
              <option value='30'>30 дней</option>
              <option value='90'>90 дней</option>
            </select>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-4 gap-4'>
              {[
                {
                  label: 'Посетителей',
                  value: '1 247',
                  change: '+12%',
                  positive: true,
                  icon: Users,
                },
                {
                  label: 'Просмотров',
                  value: '3 891',
                  change: '+8%',
                  positive: true,
                  icon: MousePointerClick,
                },
                {
                  label: 'Стр/визит',
                  value: '4.2',
                  change: '−0.3',
                  positive: false,
                  icon: BarChart3,
                },
                {
                  label: 'Время',
                  value: '2:34',
                  change: '+15с',
                  positive: true,
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

            <div className='flex items-end gap-0.5 h-16'>
              {MOCK_METRIKA_STATS.dailyVisits.map((visits, i) => {
                const max = Math.max(...MOCK_METRIKA_STATS.dailyVisits);
                const height = max > 0 ? (visits / max) * 100 : 0;
                return (
                  <div
                    key={i}
                    className='flex-1 bg-muted-foreground/20 rounded-t'
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>

            <p className='text-sm text-muted-foreground'>
              Отказы: {MOCK_METRIKA_STATS.bounceRate.value}%{' '}
              <span className='text-green-600'>
                (↓ {Math.abs(MOCK_METRIKA_STATS.bounceRate.change)}%)
              </span>
            </p>

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
              Добавьте OAuth-токен для отображения статистики
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
