import { useEffect, useState } from 'react';
import {
  ExternalLink,
  Trophy,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Search,
} from 'lucide-react';
import { LoadingSpinner } from '@/app/components/common';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';
import {
  getWebmasterSummary,
  getWebmasterIndexing,
  getWebmasterQueries,
  type YandexConnectionStatus,
  type WebmasterSummaryData,
  type WebmasterIndexingData,
  type WebmasterQueryData,
} from '@/lib/api-client';

interface YandexWebmasterSettingsProps {
  /** Статус подключения Yandex OAuth (поднят в SeoPage) */
  connection: YandexConnectionStatus | null;
  onChangeDetected: () => void;
}

function formatImpressions(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function MiniBarChart({
  data,
  height = 'h-12',
}: {
  data: number[];
  height?: string;
}) {
  const max = Math.max(...data);
  return (
    <div className={`flex items-end gap-0.5 ${height} w-full`}>
      {data.map((value, i) => (
        <div
          key={i}
          className='flex-1 bg-muted-foreground/20 rounded-t-sm min-h-[2px]'
          style={{ height: `${max > 0 ? (value / max) * 100 : 0}%` }}
        />
      ))}
    </div>
  );
}

export function YandexWebmasterSettings({
  connection,
  onChangeDetected: _onChangeDetected,
}: YandexWebmasterSettingsProps) {
  const [summary, setSummary] = useState<WebmasterSummaryData | null>(null);
  const [indexing, setIndexing] = useState<WebmasterIndexingData | null>(null);
  const [queries, setQueries] = useState<WebmasterQueryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isConnected = connection?.connected ?? false;

  useEffect(() => {
    if (!isConnected) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const [summaryData, indexingData, queriesData] = await Promise.all([
          getWebmasterSummary().catch(() => null),
          getWebmasterIndexing().catch(() => null),
          getWebmasterQueries().catch((): WebmasterQueryData[] => []),
        ]);

        if (summaryData) setSummary(summaryData);
        if (indexingData) setIndexing(indexingData);
        setQueries(queriesData ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [isConnected]);

  if (isLoading) {
    return <LoadingSpinner className='py-12' />;
  }

  if (!isConnected) {
    return (
      <Card className='border-dashed'>
        <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
          <Search className='size-12 text-muted-foreground/30 mb-4' />
          <h3 className='text-lg font-semibold mb-2'>
            Яндекс Вебмастер не подключён
          </h3>
          <p className='text-sm text-muted-foreground max-w-sm'>
            Настройте подключение к Яндекс API в разделе «Яндекс.Метрика»
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='border-dashed border-red-200'>
        <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
          <AlertTriangle className='size-12 text-red-400 mb-4' />
          <h3 className='text-lg font-semibold mb-2'>Ошибка загрузки</h3>
          <p className='text-sm text-muted-foreground max-w-sm'>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-semibold'>Яндекс Вебмастер</h2>
        <p className='text-sm text-muted-foreground'>
          Индексация и видимость в поисковой выдаче Яндекса
        </p>
      </div>

      {/* Card 1: Обзор сайта */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Статус в Яндексе</CardTitle>
            <CardDescription>profitableweb.ru</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-3 gap-4 text-center'>
              <div className='flex flex-col items-center gap-1'>
                <Trophy className='size-5 text-primary' />
                <span className='text-3xl font-bold'>{summary.sqi}</span>
                <span className='text-xs text-muted-foreground'>SQI</span>
              </div>
              <div className='flex flex-col items-center gap-1'>
                <FileText className='size-5 text-primary' />
                <span className='text-3xl font-bold'>
                  {summary.searchablePages}
                </span>
                <span className='text-xs text-muted-foreground'>В индексе</span>
              </div>
              <div className='flex flex-col items-center gap-1'>
                <AlertTriangle
                  className={cn(
                    'size-5',
                    summary.siteProblems > 0
                      ? 'text-amber-500'
                      : 'text-muted-foreground'
                  )}
                />
                <span
                  className={cn(
                    'text-3xl font-bold',
                    summary.siteProblems > 0 && 'text-amber-500'
                  )}
                >
                  {summary.siteProblems}
                </span>
                <span className='text-xs text-muted-foreground'>Проблем</span>
              </div>
            </div>

            {summary.sqiHistory.length > 1 && (
              <div className='space-y-2'>
                <MiniBarChart data={summary.sqiHistory} />
                <p className='text-xs text-muted-foreground text-center'>
                  SQI: {summary.sqiHistory[0]} →{' '}
                  {summary.sqiHistory[summary.sqiHistory.length - 1]}
                </p>
              </div>
            )}

            <Button variant='outline' className='w-full gap-2' asChild>
              <a
                href='https://webmaster.yandex.ru'
                target='_blank'
                rel='noopener noreferrer'
              >
                Открыть Яндекс Вебмастер
                <ExternalLink className='size-4' />
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Card 2: Индексация страниц */}
      {indexing && (
        <Card>
          <CardHeader>
            <CardTitle>Индексация страниц</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between p-3 rounded-lg border'>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='size-5 text-green-500' />
                  <div>
                    <p className='text-sm font-medium'>Проиндексировано</p>
                    <p className='text-xs text-muted-foreground'>
                      {indexing.indexed.count} стр.
                    </p>
                  </div>
                </div>
                <Badge variant='secondary'>{indexing.indexed.percent}%</Badge>
              </div>

              <div className='flex items-center justify-between p-3 rounded-lg border'>
                <div className='flex items-center gap-3'>
                  <Clock className='size-5 text-yellow-500' />
                  <div>
                    <p className='text-sm font-medium'>В очереди</p>
                    <p className='text-xs text-muted-foreground'>
                      {indexing.pending.count} стр.
                    </p>
                  </div>
                </div>
                <Badge variant='secondary'>{indexing.pending.percent}%</Badge>
              </div>

              <div className='flex items-center justify-between p-3 rounded-lg border'>
                <div className='flex items-center gap-3'>
                  <XCircle className='size-5 text-red-500' />
                  <div>
                    <p className='text-sm font-medium'>Исключено</p>
                    <p className='text-xs text-muted-foreground'>
                      {indexing.excluded.count} стр.
                    </p>
                  </div>
                </div>
                <Badge variant='secondary'>{indexing.excluded.percent}%</Badge>
              </div>
            </div>

            {indexing.history.length > 0 && (
              <div className='space-y-2'>
                <p className='text-xs text-muted-foreground'>
                  История индексации (30 дней)
                </p>
                <MiniBarChart data={indexing.history} height='h-10' />
              </div>
            )}

            <p className='text-xs text-muted-foreground'>
              Последнее обновление: {indexing.lastUpdated}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Card 3: Популярные поисковые запросы */}
      {queries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Популярные поисковые запросы</CardTitle>
            <CardDescription>Топ запросов в Яндексе</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              {queries.map((query, index) => (
                <div
                  key={index}
                  className='flex items-center gap-3 py-2 border-b last:border-0'
                >
                  <span className='text-sm text-muted-foreground w-5 text-right'>
                    {index + 1}
                  </span>
                  <span className='text-sm font-medium flex-1'>
                    {query.query}
                  </span>
                  <Badge variant='outline'>pos {query.position}</Badge>
                  <span className='text-xs text-muted-foreground whitespace-nowrap'>
                    {formatImpressions(query.impressions)} показов
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Пустое состояние если нет данных но подключено */}
      {!summary && !indexing && queries.length === 0 && (
        <Card className='border-dashed'>
          <CardContent className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
            <Search className='h-12 w-12 mb-4' />
            <p className='text-sm'>
              Сайт не найден в Яндекс Вебмастере. Добавьте profitableweb.ru в
              Вебмастер.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
