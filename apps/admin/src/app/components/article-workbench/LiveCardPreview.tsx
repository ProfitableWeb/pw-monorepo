import { useState, useCallback } from 'react';
import { ImagePlus, Upload, Sun, Moon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';

interface LiveCardPreviewProps {
  title: string;
  category: string;
  excerpt: string;
  imageUrl?: string;
  tags?: string[];
  onImageChange?: (file: File) => void;
}

function ImageDropZone({
  imageUrl,
  title,
  dark,
  onImageChange,
}: {
  imageUrl?: string;
  title: string;
  dark: boolean;
  onImageChange?: (file: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [hasError, setHasError] = useState(false);
  const showPlaceholder = !imageUrl || hasError;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) {
        onImageChange?.(file);
      }
    },
    [onImageChange]
  );

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onImageChange?.(file);
    };
    input.click();
  }, [onImageChange]);

  return (
    <div
      className={cn(
        'aspect-video flex items-center justify-center cursor-pointer transition-colors',
        isDragging ? 'ring-2 ring-primary ring-inset' : '',
        dark
          ? 'bg-zinc-800 hover:bg-zinc-750'
          : 'bg-zinc-100 hover:bg-zinc-150',
        isDragging && (dark ? 'bg-zinc-700' : 'bg-zinc-200')
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {showPlaceholder ? (
        <div
          className={cn(
            'flex flex-col items-center gap-2',
            dark ? 'text-zinc-500' : 'text-zinc-400'
          )}
        >
          {isDragging ? (
            <>
              <Upload className='h-8 w-8' />
              <span className='text-xs'>Отпустите для загрузки</span>
            </>
          ) : (
            <>
              <ImagePlus className='h-8 w-8' />
              <span className='text-xs'>Загрузить обложку</span>
            </>
          )}
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={title || 'Обложка статьи'}
          className='w-full h-full object-cover'
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

export function LiveCardPreview({
  title,
  category,
  excerpt,
  imageUrl,
  tags = [],
  onImageChange,
}: LiveCardPreviewProps) {
  const [previewDark, setPreviewDark] = useState(false);

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <p className='text-sm font-medium text-muted-foreground'>
          Превью карточки
        </p>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          onClick={() => setPreviewDark(v => !v)}
          title={previewDark ? 'Светлая тема' : 'Тёмная тема'}
        >
          {previewDark ? (
            <Sun className='h-3.5 w-3.5' />
          ) : (
            <Moon className='h-3.5 w-3.5' />
          )}
        </Button>
      </div>

      {/* Theme background */}
      <div
        className={cn(
          'rounded-lg border p-8 flex justify-center transition-colors',
          previewDark
            ? 'bg-zinc-950 border-zinc-800'
            : 'bg-zinc-100 border-zinc-200'
        )}
      >
        {/* Card */}
        <div
          className={cn(
            'w-full rounded-xl overflow-hidden transition-colors shadow-lg',
            previewDark
              ? 'bg-zinc-900 text-zinc-100 ring-1 ring-zinc-800'
              : 'bg-white text-zinc-900 ring-1 ring-zinc-200'
          )}
        >
          <ImageDropZone
            imageUrl={imageUrl}
            title={title}
            dark={previewDark}
            onImageChange={onImageChange}
          />

          <div className='p-5 space-y-2.5'>
            {category && (
              <span
                className={cn(
                  'inline-block text-xs font-medium px-2.5 py-1 rounded-full',
                  previewDark
                    ? 'bg-zinc-800 text-zinc-300'
                    : 'bg-zinc-100 text-zinc-600'
                )}
              >
                {category}
              </span>
            )}

            <h3 className='font-semibold text-base leading-snug line-clamp-2'>
              {title || 'Заголовок статьи'}
            </h3>

            <p
              className={cn(
                'text-sm leading-relaxed line-clamp-3',
                previewDark ? 'text-zinc-400' : 'text-zinc-500'
              )}
            >
              {excerpt || 'Краткое описание статьи...'}
            </p>

            {tags.length > 0 && (
              <div className='flex flex-wrap gap-1.5 pt-1'>
                {tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      previewDark
                        ? 'text-zinc-400 bg-zinc-800'
                        : 'text-zinc-500 bg-zinc-100'
                    )}
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span
                    className={cn(
                      'text-xs',
                      previewDark ? 'text-zinc-500' : 'text-zinc-400'
                    )}
                  >
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
