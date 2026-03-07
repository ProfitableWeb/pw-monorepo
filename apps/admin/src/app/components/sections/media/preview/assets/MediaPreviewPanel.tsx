import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { MediaImageWithLoader } from '../../MediaImageWithLoader';
import { Copy, Upload, Image as ImageIcon } from 'lucide-react';
import type { FileType, MediaFile } from '../../media.types';
import {
  formatBytes,
  getFileIcon,
  handleCopyUrl,
  formatDuration,
} from '../../media.utils';

interface MediaPreviewPanelProps {
  file: MediaFile;
  onReplaceFile: () => void;
  formatBytes?: (bytes: number) => string;
  formatDuration?: (seconds: number) => string;
  getFileIcon?: (type: FileType) => any;
  handleCopyUrl?: (url: string) => void;
}

/** Левая колонка диалога: превью, URL, размеры, информация о файле */
export function MediaPreviewPanel({
  file,
  onReplaceFile,
  formatBytes: formatBytesProp,
  formatDuration: formatDurationProp,
  getFileIcon: getFileIconProp,
  handleCopyUrl: handleCopyUrlProp,
}: MediaPreviewPanelProps) {
  const fmtBytes = formatBytesProp || formatBytes;
  const fmtDuration = formatDurationProp || formatDuration;
  const fileIcon = getFileIconProp || getFileIcon;
  const copyUrl = handleCopyUrlProp || handleCopyUrl;

  const Icon = fileIcon(file.type);

  return (
    <div className='space-y-4'>
      <div>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='font-medium'>Предпросмотр</h3>
          <Button size='sm' variant='outline' onClick={onReplaceFile}>
            <Upload className='h-3.5 w-3.5 mr-1.5' />
            Заменить файл
          </Button>
        </div>
        <div className='rounded-lg border overflow-hidden bg-muted/30 max-h-[500px] flex items-center justify-center'>
          {file.type === 'image' ? (
            <MediaImageWithLoader
              src={file.url}
              alt={file.seo?.alt || file.name}
              className='w-full h-auto max-h-[500px] object-contain'
            />
          ) : (
            <div className='aspect-video flex items-center justify-center'>
              <Icon className='h-24 w-24 text-muted-foreground' />
            </div>
          )}
        </div>
      </div>

      {/* URL */}
      <div>
        <Label className='text-xs text-muted-foreground mb-2 block'>
          URL файла
        </Label>
        <div className='flex gap-2'>
          <Input value={file.url} readOnly className='text-sm font-mono' />
          <Button size='sm' variant='outline' onClick={() => copyUrl(file.url)}>
            <Copy className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Варианты размеров */}
      {file.resizes && file.resizes.length > 0 && (
        <div>
          <h3 className='font-medium mb-3 flex items-center gap-2'>
            <ImageIcon className='h-4 w-4' />
            Доступные размеры
          </h3>
          <div className='space-y-2'>
            {file.resizes.map((resize, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors'
              >
                <div>
                  <p className='font-medium text-sm'>{resize.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {resize.width} × {resize.height}
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-sm text-muted-foreground'>
                    {fmtBytes(resize.size)}
                  </span>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => copyUrl(resize.url)}
                  >
                    <Copy className='h-3.5 w-3.5' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Информация о файле */}
      <div>
        <h3 className='font-medium mb-3'>Информация о файле</h3>
        <div className='grid grid-cols-2 gap-3'>
          <div className='p-3 border rounded-lg bg-card'>
            <Label className='text-xs text-muted-foreground'>Размер</Label>
            <p className='text-sm font-medium mt-1'>{fmtBytes(file.size)}</p>
          </div>
          <div className='p-3 border rounded-lg bg-card'>
            <Label className='text-xs text-muted-foreground'>Назначения</Label>
            <p className='text-sm font-medium mt-1 capitalize'>
              {file.purposes && file.purposes.length > 0
                ? file.purposes.join(', ')
                : '—'}
            </p>
          </div>
          {file.dimensions && (
            <div className='p-3 border rounded-lg bg-card'>
              <Label className='text-xs text-muted-foreground'>
                Разрешение
              </Label>
              <p className='text-sm font-medium mt-1'>
                {file.dimensions.width} × {file.dimensions.height}
              </p>
            </div>
          )}
          {file.duration && (
            <div className='p-3 border rounded-lg bg-card'>
              <Label className='text-xs text-muted-foreground'>
                Длительность
              </Label>
              <p className='text-sm font-medium mt-1'>
                {fmtDuration(file.duration)}
              </p>
            </div>
          )}
          <div className='p-3 border rounded-lg bg-card'>
            <Label className='text-xs text-muted-foreground'>Загружен</Label>
            <p className='text-sm font-medium mt-1'>
              {file.uploadedAt.toLocaleDateString('ru-RU')}
            </p>
          </div>
          <div className='p-3 border rounded-lg bg-card'>
            <Label className='text-xs text-muted-foreground'>
              Использований
            </Label>
            <p className='text-sm font-medium mt-1'>
              {file.usedIn} {file.usedIn === 1 ? 'статья' : 'статей'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
