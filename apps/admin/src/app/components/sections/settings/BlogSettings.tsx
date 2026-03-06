import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import {
  Eye,
  Clock,
  Users,
  Shield,
  Lock,
  MessageSquare,
  Rss,
  Type,
} from 'lucide-react';
import { SettingRow } from './SettingRow';

// Компонент настроек блога
export function BlogSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Настройки блога
        </h2>
        <p className='text-muted-foreground'>
          Управление публикациями и взаимодействием с читателями
        </p>
      </div>

      <Tabs defaultValue='publishing' className='w-full'>
        <TabsList>
          <TabsTrigger value='publishing'>Публикация</TabsTrigger>
          <TabsTrigger value='comments'>Комментарии</TabsTrigger>
          <TabsTrigger value='rss'>RSS</TabsTrigger>
        </TabsList>

        <TabsContent value='publishing' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Параметры публикации</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Eye}
                label='Автопубликация'
                description='Автоматически публиковать статьи по расписанию'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Clock}
                label='Показывать дату изменения'
                description='Отображать дату последнего обновления статьи'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Users}
                label='Показывать автора'
                description='Отображать информацию об авторе в статье'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Формат контента</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='excerpt-length'>Длина анонса (символов)</Label>
                <Input
                  id='excerpt-length'
                  type='number'
                  defaultValue='160'
                  onChange={onChangeDetected}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='posts-per-page'>Статей на странице</Label>
                <Input
                  id='posts-per-page'
                  type='number'
                  defaultValue='10'
                  onChange={onChangeDetected}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='comments' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <MessageSquare className='size-4' />
                Комментарии
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={MessageSquare}
                label='Разрешить комментарии'
                description='Пользователи могут комментировать статьи'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Shield}
                label='Модерация комментариев'
                description='Требовать одобрение перед публикацией'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Lock}
                label='Комментарии только для авторизованных'
                description='Разреить комментировать только зарегистрированным пользователям'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='rss' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Rss className='size-4' />
                RSS лента
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Rss}
                label='Включить RSS'
                description='Разрешить подписку через RSS'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <div className='space-y-2'>
                <Label htmlFor='rss-items'>Статей в ленте</Label>
                <Input
                  id='rss-items'
                  type='number'
                  defaultValue='20'
                  onChange={onChangeDetected}
                />
              </div>
              <Separator />
              <SettingRow
                icon={Type}
                label='Полный текст в RSS'
                description='Включать полный текст статьи вместо анонса'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
