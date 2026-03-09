import { Label } from '@/app/components/ui/label';
import { Camera } from 'lucide-react';
import type { MediaFile } from '../../media.types';

interface MediaExifFormProps {
  file: MediaFile;
}

/** EXIF метаданные изображения (read-only) */
export function MediaExifForm({ file }: MediaExifFormProps) {
  const exif = file.exif;
  if (!exif) return null;

  // Собираем только заполненные поля
  const fields = [
    { label: 'Дата съёмки', value: exif.dateTaken },
    { label: 'Камера', value: exif.camera },
    { label: 'Объектив', value: exif.lens },
    { label: 'ISO', value: exif.iso },
    { label: 'Диафрагма', value: exif.aperture },
    { label: 'Выдержка', value: exif.shutterSpeed },
    { label: 'Фокусное расстояние', value: exif.focalLength },
  ].filter(f => f.value);

  if (fields.length === 0) return null;

  return (
    <div>
      <div className='flex items-center gap-2 mb-3'>
        <Camera className='h-4 w-4' />
        <h3 className='font-medium'>EXIF метаданные</h3>
      </div>
      <div className='grid grid-cols-2 gap-3'>
        {fields.map(field => (
          <div key={field.label} className='p-3 border rounded-lg bg-card'>
            <Label className='text-xs text-muted-foreground'>
              {field.label}
            </Label>
            <p className='text-sm font-medium mt-1'>{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
