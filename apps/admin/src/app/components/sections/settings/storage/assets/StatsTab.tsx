/**
 * PW-041-D1 | Таб «Статистика» — кол-во файлов, размер, типы.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import {
  Image,
  FileText,
  Film,
  Music,
  Files,
  Database,
  Users,
} from 'lucide-react';
import type { StorageStats } from '../storage.types';

interface StatsTabProps {
  stats: StorageStats;
}

/** Форматирование байт → KB / MB / GB */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[i]}`;
}

/** Форматирование числа с разделителями */
function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU');
}

const TYPE_META: Record<
  string,
  { label: string; icon: typeof Image; bgColor: string }
> = {
  image: {
    label: 'Изображения',
    icon: Image,
    bgColor: 'bg-blue-500',
  },
  document: {
    label: 'Документы',
    icon: FileText,
    bgColor: 'bg-amber-500',
  },
  video: {
    label: 'Видео',
    icon: Film,
    bgColor: 'bg-purple-500',
  },
  audio: {
    label: 'Аудио',
    icon: Music,
    bgColor: 'bg-emerald-500',
  },
};

export function StatsTab({ stats }: StatsTabProps) {
  const totalByType = Object.values(stats.byType).reduce((a, b) => a + b, 0);

  return (
    <div className='space-y-6'>
      {/* Сводные карточки */}
      <div className='grid grid-cols-3 gap-4'>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2.5 rounded-lg bg-muted'>
                <Files className='size-5 text-muted-foreground' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Медиафайлов</p>
                <p className='text-2xl font-bold'>
                  {formatNumber(stats.mediaFiles)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2.5 rounded-lg bg-muted'>
                <Database className='size-5 text-muted-foreground' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Общий размер</p>
                <p className='text-2xl font-bold'>
                  {formatBytes(stats.mediaSize)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2.5 rounded-lg bg-muted'>
                <Users className='size-5 text-muted-foreground' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Аватарок</p>
                <p className='text-2xl font-bold'>
                  {formatNumber(stats.avatarsCount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* По типам файлов */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Распределение по типам</CardTitle>
          <CardDescription>Количество медиафайлов каждого типа</CardDescription>
        </CardHeader>
        <CardContent>
          {totalByType === 0 ? (
            <p className='text-sm text-muted-foreground text-center py-6'>
              Медиафайлы ещё не загружены
            </p>
          ) : (
            <div className='space-y-4'>
              {Object.entries(stats.byType).map(([type, count]) => {
                const meta = TYPE_META[type] || {
                  label: type,
                  icon: FileText,
                  bgColor: 'bg-muted-foreground',
                };
                const Icon = meta.icon;
                const percent =
                  totalByType > 0 ? (count / totalByType) * 100 : 0;

                return (
                  <div key={type} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Icon className='size-4 text-muted-foreground' />
                        <span className='text-sm font-medium'>
                          {meta.label}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-mono'>
                          {formatNumber(count)}
                        </span>
                        <span className='text-xs text-muted-foreground w-10 text-right'>
                          {Math.round(percent)}%
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={percent}
                      className={`h-2 [&>[data-slot=progress-indicator]]:${meta.bgColor}`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
