import { useCallback } from 'react';
import { ImagePlus, Upload } from 'lucide-react';

interface TelegramPreviewProps {
  title: string;
  description: string;
  imageUrl?: string;
  onImageUpload?: (file: File) => void;
}

export function TelegramPreview({
  title,
  description,
  imageUrl,
  onImageUpload,
}: TelegramPreviewProps) {
  const displayTitle = title || 'Заголовок статьи';
  const displayDesc = description
    ? description.length > 120
      ? description.slice(0, 120).trimEnd() + '...'
      : description
    : 'Описание статьи для превью ссылки...';

  const handleClick = useCallback(() => {
    if (!onImageUpload) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onImageUpload(file);
    };
    input.click();
  }, [onImageUpload]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!onImageUpload) return;
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) {
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className='space-y-2'>
      <p className='text-xs font-medium text-muted-foreground'>Telegram</p>
      <div className='rounded-lg overflow-hidden border bg-muted/30'>
        {/* Область изображения — клик для загрузки */}
        <div
          className='aspect-[1.91/1] bg-muted/50 flex items-center justify-center cursor-pointer group/tg-img relative'
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt=''
                className='w-full h-full object-cover grayscale'
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {onImageUpload && (
                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover/tg-img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1'>
                  <Upload className='size-5 text-white/80' />
                  <span className='text-[11px] text-white/70'>Заменить</span>
                </div>
              )}
            </>
          ) : (
            <div className='flex flex-col items-center gap-1.5 text-muted-foreground/40 group-hover/tg-img:text-muted-foreground/60 transition-colors'>
              <ImagePlus className='size-6' />
              <span className='text-[11px]'>
                {onImageUpload ? 'Загрузить OG-изображение' : 'Нет изображения'}
              </span>
            </div>
          )}
        </div>

        {/* Контент с левой границей */}
        <div className='flex'>
          <div className='w-[3px] shrink-0 bg-muted-foreground/20' />
          <div className='p-3 space-y-1 min-w-0'>
            <div className='text-[14px] font-semibold leading-tight text-foreground truncate'>
              {displayTitle}
            </div>
            <div className='text-[13px] leading-[1.4] text-muted-foreground line-clamp-2'>
              {displayDesc}
            </div>
            <div className='text-[12px] text-muted-foreground/60'>
              profitableweb.ru
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
