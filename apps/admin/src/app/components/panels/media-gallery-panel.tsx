import { FileIcon, ImageIcon } from 'lucide-react';
import { formatDate } from '@/app/components/common';
import { useResearchStore } from '@/app/store/research-store';
import type { PanelComponentProps } from '@/app/components/workspace/panel-registry';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaGalleryPanel({ itemId }: PanelComponentProps) {
  const { media } = useResearchStore();

  // Если itemId — конкретный медиафайл, показать его детали
  const singleItem = media.find(m => m.id === itemId);

  if (singleItem) {
    const isImage = singleItem.mimeType.startsWith('image/');
    return (
      <div className='p-4 space-y-3 overflow-auto h-full'>
        <div className='flex items-center gap-2'>
          {isImage ? (
            <ImageIcon className='h-5 w-5 text-muted-foreground' />
          ) : (
            <FileIcon className='h-5 w-5 text-muted-foreground' />
          )}
          <h2 className='font-semibold text-sm'>{singleItem.fileName}</h2>
        </div>

        {/* Область превью */}
        {isImage ? (
          <div className='rounded-lg border bg-muted/30 flex items-center justify-center aspect-video'>
            <div className='text-center text-muted-foreground'>
              <ImageIcon className='h-12 w-12 mx-auto mb-2 opacity-20' />
              <p className='text-xs'>{singleItem.fileName}</p>
            </div>
          </div>
        ) : (
          <div className='rounded-lg border bg-muted/30 flex items-center justify-center p-8'>
            <div className='text-center text-muted-foreground'>
              <FileIcon className='h-12 w-12 mx-auto mb-2 opacity-20' />
              <p className='text-xs'>{singleItem.fileName}</p>
            </div>
          </div>
        )}

        {/* Метаданные */}
        <div className='space-y-1 text-xs text-muted-foreground'>
          <p>Тип: {singleItem.mimeType}</p>
          <p>Размер: {formatFileSize(singleItem.size)}</p>
          <p>Загружено: {formatDate(singleItem.createdAt)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center h-full text-muted-foreground text-sm'>
      Медиафайл не найден
    </div>
  );
}
