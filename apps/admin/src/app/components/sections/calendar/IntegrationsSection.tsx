import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';

export function IntegrationsSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-4'>Интеграции</h3>
        <div className='space-y-4'>
          <div className='space-y-3'>
            <Label>Социальные сети</Label>

            <div className='space-y-2'>
              <div className='flex items-center justify-between p-3 border rounded-lg'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded bg-blue-500 flex items-center justify-center text-white font-bold'>
                    VK
                  </div>
                  <div>
                    <div className='text-sm font-medium'>ВКонтакте</div>
                    <div className='text-xs text-muted-foreground'>
                      Не одключено
                    </div>
                  </div>
                </div>
                <Button size='sm' variant='outline'>
                  Подключить
                </Button>
              </div>

              <div className='flex items-center justify-between p-3 border rounded-lg'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded bg-sky-500 flex items-center justify-center text-white font-bold'>
                    TG
                  </div>
                  <div>
                    <div className='text-sm font-medium'>Telegram</div>
                    <div className='text-xs text-green-600 dark:text-green-400'>
                      Подключено
                    </div>
                  </div>
                </div>
                <Button size='sm' variant='outline'>
                  Настроить
                </Button>
              </div>

              <div className='flex items-center justify-between p-3 border rounded-lg'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold'>
                    X
                  </div>
                  <div>
                    <div className='text-sm font-medium'>X (Twitter)</div>
                    <div className='text-xs text-muted-foreground'>
                      Не подключено
                    </div>
                  </div>
                </div>
                <Button size='sm' variant='outline'>
                  Подключить
                </Button>
              </div>
            </div>
          </div>

          <div className='space-y-3 pt-4'>
            <Label>Платформы публикации</Label>

            <div className='space-y-2'>
              <div className='flex items-center justify-between p-3 border rounded-lg'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded bg-orange-500 flex items-center justify-center text-white font-bold'>
                    H
                  </div>
                  <div>
                    <div className='text-sm font-medium'>Habr</div>
                    <div className='text-xs text-muted-foreground'>
                      Не подключено
                    </div>
                  </div>
                </div>
                <Button size='sm' variant='outline'>
                  Подключить
                </Button>
              </div>

              <div className='flex items-center justify-between p-3 border rounded-lg'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold'>
                    M
                  </div>
                  <div>
                    <div className='text-sm font-medium'>Medium</div>
                    <div className='text-xs text-muted-foreground'>
                      Не подключено
                    </div>
                  </div>
                </div>
                <Button size='sm' variant='outline'>
                  Подключить
                </Button>
              </div>

              <div className='flex items-center justify-between p-3 border rounded-lg'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white font-bold'>
                    WP
                  </div>
                  <div>
                    <div className='text-sm font-medium'>WordPress</div>
                    <div className='text-xs text-green-600 dark:text-green-400'>
                      Подключено
                    </div>
                  </div>
                </div>
                <Button size='sm' variant='outline'>
                  Настроить
                </Button>
              </div>
            </div>
          </div>

          <div className='border-t pt-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Автопубликация</Label>
                <p className='text-xs text-muted-foreground'>
                  Автоматически публиковать во все подключенные каналы
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
