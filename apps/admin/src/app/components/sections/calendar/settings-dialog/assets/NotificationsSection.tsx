import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';

export function NotificationsSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-4'>Уведомления</h3>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Включить уведомления</Label>
              <p className='text-xs text-muted-foreground'>
                Получать напоминания о публикациях
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className='border-t pt-4 space-y-4'>
            <div className='font-medium text-sm'>Типы уведомлений</div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Напоминание о публикации</Label>
                <p className='text-xs text-muted-foreground'>
                  За 1 час до запланированного времени
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Новые AI-предложения</Label>
                <p className='text-xs text-muted-foreground'>
                  При появлении новых идей от AI
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Еженедельный дайджест</Label>
                <p className='text-xs text-muted-foreground'>
                  Обзор планов на неделю каждый понедельник
                </p>
              </div>
              <Switch />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Пропущенные публикации</Label>
                <p className='text-xs text-muted-foreground'>
                  Оповещение о несостоявшихся публикациях
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className='border-t pt-4 space-y-4'>
            <div className='font-medium text-sm'>Каналы дставки</div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Email уведомления</Label>
                <p className='text-xs text-muted-foreground'>
                  Отправлять на почту
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='email'>Email адрес</Label>
              <Input
                id='email'
                type='email'
                placeholder='your@email.com'
                defaultValue='editor@blog.ru'
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Push-уведомления</Label>
                <p className='text-xs text-muted-foreground'>
                  Браузерные уведомления
                </p>
              </div>
              <Switch />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Telegram бот</Label>
                <p className='text-xs text-muted-foreground'>
                  Уведомления в Telegram
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
