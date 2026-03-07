import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import {
  Zap,
  Key,
  Webhook,
  MessageSquare,
  Activity,
  BarChart3,
} from 'lucide-react';
import { SettingRow } from './shared/SettingRow';

// Компонент настроек интеграций
export function IntegrationSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Интеграции
        </h2>
        <p className='text-muted-foreground'>
          Подключение внешних сервисов и API
        </p>
      </div>

      <Tabs defaultValue='services' className='w-full'>
        <TabsList>
          <TabsTrigger value='services'>Сервисы</TabsTrigger>
          <TabsTrigger value='api-keys'>API ключи</TabsTrigger>
          <TabsTrigger value='webhooks'>Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value='services' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Подключенные сервисы</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={BarChart3}
                label='Google Analytics'
                description='Аналитика посещаемости и поведения пользователей'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={MessageSquare}
                label='Telegram Bot'
                description='Уведомления и управление через Telegram'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Zap}
                label='Zapier'
                description='Автоматизация и интеграция с другими сервисами'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='api-keys' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Key className='size-4' />
                API ключи
              </CardTitle>
              <CardDescription>
                Управление ключами доступа к API
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center justify-between p-3 rounded-lg border'>
                  <div>
                    <p className='font-medium text-sm'>Основной API ключ</p>
                    <p className='text-xs text-muted-foreground'>
                      Создан 15 янв 2026
                    </p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Показать
                  </Button>
                </div>
                <div className='flex items-center justify-between p-3 rounded-lg border'>
                  <div>
                    <p className='font-medium text-sm'>Публичный ключ</p>
                    <p className='text-xs text-muted-foreground'>
                      Создан 20 янв 2026
                    </p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Показать
                  </Button>
                </div>
              </div>
              <Button className='w-full' variant='outline'>
                <Key className='size-4 mr-2' />
                Создать новый ключ
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='webhooks' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Webhook className='size-4' />
                Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Webhook}
                label='Включить webhooks'
                description='Отправлять события на внешние URL'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Activity}
                label='Логирование событий'
                description='Сохранять историю отправленных webhook событий'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
