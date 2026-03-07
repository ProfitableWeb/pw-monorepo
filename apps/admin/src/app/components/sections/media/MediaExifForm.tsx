import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Camera } from 'lucide-react';
import type { MediaFile } from './media.types';

interface MediaExifFormProps {
  file: MediaFile;
  onFieldChange: (section: 'exif', field: string, value: string) => void;
}

/** Форма EXIF метаданных изображения */
export function MediaExifForm({ file, onFieldChange }: MediaExifFormProps) {
  return (
    <div>
      <div className='flex items-center gap-2 mb-3'>
        <Camera className='h-4 w-4' />
        <h3 className='font-medium'>EXIF метаданные</h3>
      </div>
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <Label htmlFor='exif-date' className='text-sm font-medium'>
              Дата съёмки
            </Label>
            <Input
              id='exif-date'
              value={file.exif?.dateTaken || ''}
              onChange={e => onFieldChange('exif', 'dateTaken', e.target.value)}
              placeholder='2024-01-10 14:23:00'
              className='mt-1.5'
            />
          </div>

          <div>
            <Label htmlFor='exif-camera' className='text-sm font-medium'>
              Камера
            </Label>
            <Input
              id='exif-camera'
              value={file.exif?.camera || ''}
              onChange={e => onFieldChange('exif', 'camera', e.target.value)}
              placeholder='Canon EOS R5'
              className='mt-1.5'
            />
          </div>
        </div>

        <div>
          <Label htmlFor='exif-lens' className='text-sm font-medium'>
            Объектив
          </Label>
          <Input
            id='exif-lens'
            value={file.exif?.lens || ''}
            onChange={e => onFieldChange('exif', 'lens', e.target.value)}
            placeholder='RF 24-70mm f/2.8L IS USM'
            className='mt-1.5'
          />
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div>
            <Label htmlFor='exif-iso' className='text-sm font-medium'>
              ISO
            </Label>
            <Input
              id='exif-iso'
              value={file.exif?.iso || ''}
              onChange={e => onFieldChange('exif', 'iso', e.target.value)}
              placeholder='400'
              className='mt-1.5'
            />
          </div>

          <div>
            <Label htmlFor='exif-aperture' className='text-sm font-medium'>
              Диафрагма
            </Label>
            <Input
              id='exif-aperture'
              value={file.exif?.aperture || ''}
              onChange={e => onFieldChange('exif', 'aperture', e.target.value)}
              placeholder='f/2.8'
              className='mt-1.5'
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div>
            <Label htmlFor='exif-shutter' className='text-sm font-medium'>
              Выдержка
            </Label>
            <Input
              id='exif-shutter'
              value={file.exif?.shutterSpeed || ''}
              onChange={e =>
                onFieldChange('exif', 'shutterSpeed', e.target.value)
              }
              placeholder='1/125'
              className='mt-1.5'
            />
          </div>

          <div>
            <Label htmlFor='exif-focal' className='text-sm font-medium'>
              Фокусное расстояние
            </Label>
            <Input
              id='exif-focal'
              value={file.exif?.focalLength || ''}
              onChange={e =>
                onFieldChange('exif', 'focalLength', e.target.value)
              }
              placeholder='50mm'
              className='mt-1.5'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
