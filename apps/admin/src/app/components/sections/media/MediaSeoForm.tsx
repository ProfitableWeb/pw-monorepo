import { cn } from '@/app/components/ui/utils';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import type { MediaFile } from './media.types';

interface MediaSeoFormProps {
  file: MediaFile;
  onFieldChange: (section: 'seo', field: string, value: string) => void;
}

/** Форма SEO параметров медиафайла: имя файла, alt, caption */
export function MediaSeoForm({ file, onFieldChange }: MediaSeoFormProps) {
  return (
    <div>
      <h3 className='font-medium mb-3'>SEO параметры</h3>
      <div className='space-y-4'>
        <div>
          <Label htmlFor='seo-filename' className='text-sm font-medium'>
            Название файла
          </Label>
          <Input
            id='seo-filename'
            value={file.seo?.filename || ''}
            onChange={e => onFieldChange('seo', 'filename', e.target.value)}
            placeholder='blog-header-design-2024'
            className='mt-1.5'
          />
          <div className='flex items-center justify-between mt-1'>
            <p className='text-xs text-muted-foreground/60'>
              Используется в URL и поиске
            </p>
            <p className='text-xs text-muted-foreground/60'>
              <span
                className={cn(
                  (file.seo?.filename || '').length > 60 &&
                    'text-red-500 font-medium'
                )}
              >
                {(file.seo?.filename || '').length}
              </span>
              /60
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor='seo-alt' className='text-sm font-medium'>
            Alt текст
          </Label>
          <Input
            id='seo-alt'
            value={file.seo?.alt || ''}
            onChange={e => onFieldChange('seo', 'alt', e.target.value)}
            placeholder='Описание изображения для доступности'
            className='mt-1.5'
          />
          <div className='flex items-center justify-between mt-1'>
            <p className='text-xs text-muted-foreground/60'>
              Важно для SEO и доступности
            </p>
            <p className='text-xs text-muted-foreground/60'>
              <span
                className={cn(
                  (file.seo?.alt || '').length > 125 &&
                    'text-red-500 font-medium'
                )}
              >
                {(file.seo?.alt || '').length}
              </span>
              /125
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor='seo-caption' className='text-sm font-medium'>
            Caption (подпись)
          </Label>
          <Textarea
            id='seo-caption'
            value={file.seo?.caption || ''}
            onChange={e => onFieldChange('seo', 'caption', e.target.value)}
            placeholder='Подробное описание изображения'
            className='mt-1.5 min-h-[100px]'
          />
          <div className='flex items-center justify-between mt-1'>
            <p className='text-xs text-muted-foreground/60'>
              тображается под изображением в статьях
            </p>
            <p className='text-xs text-muted-foreground/60'>
              <span
                className={cn(
                  (file.seo?.caption || '').length > 250 &&
                    'text-red-500 font-medium'
                )}
              >
                {(file.seo?.caption || '').length}
              </span>
              /250
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
