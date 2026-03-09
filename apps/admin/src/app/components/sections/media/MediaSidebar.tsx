import { cn } from '@/app/components/ui/utils';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import { Search, Archive } from 'lucide-react';
import { PURPOSES, FILE_TYPES } from './media.constants';
import { formatBytes } from './media.utils';
import type { MediaStatsResponse } from './media.types';

const MAX_STORAGE = 5 * 1024 * 1024 * 1024; // 5 GB

interface MediaSidebarProps {
  stats?: MediaStatsResponse;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFolder: string;
  onFolderChange: (folder: string) => void;
  selectedFileType: string;
  onFileTypeChange: (type: string) => void;
}

/** Боковая панель: поиск, фильтры, хранилище */
export function MediaSidebar({
  stats,
  searchQuery,
  onSearchChange,
  selectedFolder,
  onFolderChange,
  selectedFileType,
  onFileTypeChange,
}: MediaSidebarProps) {
  const totalSize = stats?.totalSize ?? 0;
  const storagePercentage = (totalSize / MAX_STORAGE) * 100;

  return (
    <aside className='w-64 border-r bg-card flex-shrink-0 flex flex-col'>
      <div className='p-4 border-b flex-shrink-0'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Поиск файлов...'
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className='pl-9'
          />
        </div>
      </div>

      <ScrollArea className='flex-1 min-h-0'>
        <div className='p-4 space-y-6'>
          {/* Статистика хранилища */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Хранилище</span>
              <span className='font-medium'>
                {Math.round(storagePercentage)}%
              </span>
            </div>
            <div className='h-2 bg-muted rounded-full overflow-hidden'>
              <div
                className={cn(
                  'h-full transition-all',
                  storagePercentage > 90
                    ? 'bg-destructive'
                    : storagePercentage > 70
                      ? 'bg-yellow-500'
                      : 'bg-primary'
                )}
                style={{ width: `${Math.min(storagePercentage, 100)}%` }}
              />
            </div>
            <p className='text-xs text-muted-foreground'>
              {formatBytes(totalSize)} из {formatBytes(MAX_STORAGE)}
            </p>
          </div>

          <Separator />

          {/* Фильтр по назначению */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium mb-3'>Назначение</h3>
            {PURPOSES.map(purpose => {
              const Icon = purpose.icon;
              const isActive = selectedFolder === purpose.id;

              return (
                <button
                  key={purpose.id}
                  onClick={() => onFolderChange(purpose.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  )}
                >
                  <Icon className='size-4 flex-shrink-0' />
                  <span className='flex-1 text-left'>{purpose.name}</span>
                </button>
              );
            })}
          </div>

          <Separator />

          {/* Фильтр по типу файла */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium mb-3'>Тип файла</h3>
            {FILE_TYPES.map(type => {
              const Icon = type.icon;
              const count =
                type.id === 'all' ? stats?.totalCount : stats?.byType[type.id];
              const isActive = selectedFileType === type.id;

              return (
                <button
                  key={type.id}
                  onClick={() => onFileTypeChange(type.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  )}
                >
                  <Icon className='size-4 flex-shrink-0' />
                  <span className='flex-1 text-left'>{type.name}</span>
                  {type.id !== 'all' && count != null && (
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded',
                        isActive ? 'bg-background/50' : 'bg-muted'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <Separator />

          {/* Раздел резервного копирования — заглушка */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-medium'>Резервные копии</h3>
            </div>
            <div className='p-3 rounded-lg border bg-muted/30'>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Archive className='size-4' />
                <span className='text-xs'>Скоро</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
