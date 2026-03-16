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
  MOCK_WEBMASTER_SUMMARY,
  MOCK_WEBMASTER_INDEXING,
  MOCK_WEBMASTER_QUERIES,
  MOCK_YANDEX_API_CONNECTION,
} from '../seo.constants';

interface YandexWebmasterSettingsProps {
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
          style={{ height: `${(value / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export function YandexWebmasterSettings({
  onChangeDetected: _onChangeDetected,
}: YandexWebmasterSettingsProps) {
  if (!MOCK_YANDEX_API_CONNECTION.connected) {
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

  const { sqi, sqiHistory, searchablePages, siteProblems } =
    MOCK_WEBMASTER_SUMMARY;
  const { indexed, pending, excluded, history, lastUpdated } =
    MOCK_WEBMASTER_INDEXING;
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-semibold'>Яндекс Вебмастер</h2>
        <p className='text-sm text-muted-foreground'>
          Индексация и видимость в поисковой выдаче Яндекса
        </p>
      </div>

      {/* Card 1: Обзор сайта */}
      <Card>
        <CardHeader>
          <CardTitle>Статус в Яндексе</CardTitle>
          <CardDescription>profitableweb.ru</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div className='flex flex-col items-center gap-1'>
              <Trophy className='size-5 text-primary' />
              <span className='text-3xl font-bold'>{sqi}</span>
              <span className='text-xs text-muted-foreground'>SQI</span>
            </div>
            <div className='flex flex-col items-center gap-1'>
              <FileText className='size-5 text-primary' />
              <span className='text-3xl font-bold'>{searchablePages}</span>
              <span className='text-xs text-muted-foreground'>В индексе</span>
            </div>
            <div className='flex flex-col items-center gap-1'>
              <AlertTriangle
                className={cn(
                  'size-5',
                  siteProblems > 0 ? 'text-amber-500' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-3xl font-bold',
                  siteProblems > 0 && 'text-amber-500'
                )}
              >
                {siteProblems}
              </span>
              <span className='text-xs text-muted-foreground'>Проблем</span>
            </div>
          </div>

          <div className='space-y-2'>
            <MiniBarChart data={sqiHistory} />
            <p className='text-xs text-muted-foreground text-center'>
              SQI за год: {sqiHistory[0]} → {sqiHistory[sqiHistory.length - 1]}
            </p>
          </div>

          <Button variant='outline' className='w-full gap-2'>
            Открыть Яндекс Вебмастер
            <ExternalLink className='size-4' />
          </Button>
        </CardContent>
      </Card>

      {/* Card 2: Индексация страниц */}
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
                    {indexed.count} стр.
                  </p>
                </div>
              </div>
              <Badge variant='secondary'>{indexed.percent}%</Badge>
            </div>

            <div className='flex items-center justify-between p-3 rounded-lg border'>
              <div className='flex items-center gap-3'>
                <Clock className='size-5 text-yellow-500' />
                <div>
                  <p className='text-sm font-medium'>В очереди</p>
                  <p className='text-xs text-muted-foreground'>
                    {pending.count} стр.
                  </p>
                </div>
              </div>
              <Badge variant='secondary'>{pending.percent}%</Badge>
            </div>

            <div className='flex items-center justify-between p-3 rounded-lg border'>
              <div className='flex items-center gap-3'>
                <XCircle className='size-5 text-red-500' />
                <div>
                  <p className='text-sm font-medium'>Исключено</p>
                  <p className='text-xs text-muted-foreground'>
                    {excluded.count} стр.
                  </p>
                </div>
              </div>
              <Badge variant='secondary'>{excluded.percent}%</Badge>
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-xs text-muted-foreground'>
              История индексации (30 дней)
            </p>
            <MiniBarChart data={history} height='h-10' />
          </div>

          <p className='text-xs text-muted-foreground'>
            Последнее обновление: {lastUpdated}
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Популярные поисковые запросы */}
      <Card>
        <CardHeader>
          <CardTitle>Популярные поисковые запросы</CardTitle>
          <CardDescription>Топ запросов в Яндексе</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {MOCK_WEBMASTER_QUERIES.map((query, index) => (
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
    </div>
  );
}
