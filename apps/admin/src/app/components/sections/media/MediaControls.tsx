import { Button } from '@/app/components/ui/button';
import { Upload, Grid3x3, List, Trash2, X as CloseIcon } from 'lucide-react';
import { formatBytes, getFileIcon } from './media.utils';
import type { FileType, MediaFile, ViewMode } from './media.types';

interface MediaControlsProps {
  filteredFiles: MediaFile[];
  totalSize: number;
  fileTypeStats: Record<FileType, number>;
  selectedFiles: string[];
  viewMode: ViewMode;
  isUploading: boolean;
  uploadProgress: number;
  onUpload: () => void;
  onBulkDelete: () => void;
  onSelectAll: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onCancelUpload: () => void;
}

/** Управление: заголовок, карточки статистики, поиск, вид, выбор, загрузка */
export function MediaControls({
  filteredFiles,
  totalSize,
  fileTypeStats,
  selectedFiles,
  viewMode,
  isUploading,
  uploadProgress,
  onUpload,
  onBulkDelete,
  onSelectAll,
  onViewModeChange,
  onCancelUpload,
}: MediaControlsProps) {
  return (
    <>
      {/* Заголовок */}
      <div className='p-4 lg:p-6 border-b space-y-4 flex-shrink-0'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Медиатека</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              {filteredFiles.length} файлов • {formatBytes(totalSize)}{' '}
              использовано
            </p>
          </div>
          <Button onClick={onUpload}>
            <Upload className='h-4 w-4 mr-2' />
            Загрузить
          </Button>
        </div>

        {/* Карточки статистики */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
          {Object.entries(fileTypeStats).map(([type, size]) => {
            const Icon = getFileIcon(type as FileType);
            const typeNames: Record<string, string> = {
              image: 'Изображения',
              video: 'Видео',
              audio: 'Аудио',
              document: 'Документы',
            };
            return (
              <div key={type} className='p-3 border rounded-lg bg-card'>
                <div className='flex items-center gap-2 text-muted-foreground mb-1'>
                  <Icon className='h-4 w-4' />
                  <span className='text-xs font-medium'>{typeNames[type]}</span>
                </div>
                <p className='text-lg font-semibold'>{formatBytes(size)}</p>
              </div>
            );
          })}
        </div>

        {/* Управление */}
        <div className='flex items-center gap-2'>
          {selectedFiles.length > 0 && (
            <>
              <Button
                size='sm'
                variant='outline'
                onClick={onBulkDelete}
                className='text-destructive'
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Удалить ({selectedFiles.length})
              </Button>
              <div className='h-4 w-px bg-border' />
            </>
          )}

          <Button size='sm' variant='outline' onClick={onSelectAll}>
            {selectedFiles.length === filteredFiles.length
              ? 'Снять все'
              : 'Выбрать все'}
          </Button>

          <div className='flex-1' />

          <div className='flex items-center gap-1 border rounded-lg p-1'>
            <Button
              size='sm'
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('grid')}
              className='h-7 w-7 p-0'
            >
              <Grid3x3 className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('list')}
              className='h-7 w-7 p-0'
            >
              <List className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Прогресс загрузки */}
      {isUploading && (
        <div className='px-4 lg:px-6 py-3 border-b bg-muted/30 flex-shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='flex-1'>
              <div className='flex items-center justify-between mb-1'>
                <span className='text-sm font-medium'>Загрузка файлов...</span>
                <span className='text-sm text-muted-foreground'>
                  {uploadProgress}%
                </span>
              </div>
              <div className='h-2 bg-muted rounded-full overflow-hidden'>
                <div
                  className='h-full bg-primary transition-all'
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
            <Button size='sm' variant='ghost' onClick={onCancelUpload}>
              <CloseIcon className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
