import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import type { AvatarCardProps } from '../profile-settings.types';

export function AvatarCard({
  avatar,
  userName,
  uploading,
  fileInputRef,
  onUpload,
  onDelete,
}: AvatarCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg flex items-center gap-2'>
          <Camera className='size-4' />
          Аватар
        </CardTitle>
        <CardDescription>Фото профиля</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-6'>
          <div className='relative size-20 rounded-full overflow-hidden bg-muted flex-shrink-0'>
            {avatar ? (
              <img
                src={avatar}
                alt={userName}
                className='size-full object-cover'
              />
            ) : (
              <div className='size-full flex items-center justify-center text-2xl font-medium text-muted-foreground'>
                {userName?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className='flex gap-2'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/jpeg,image/png,image/gif,image/webp'
              className='hidden'
              onChange={onUpload}
            />
            <Button
              variant='outline'
              size='sm'
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className='size-4 mr-2 animate-spin' /> Загрузка...
                </>
              ) : (
                'Изменить'
              )}
            </Button>
            {avatar && (
              <Button
                variant='outline'
                size='sm'
                onClick={onDelete}
                disabled={uploading}
              >
                Удалить
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
