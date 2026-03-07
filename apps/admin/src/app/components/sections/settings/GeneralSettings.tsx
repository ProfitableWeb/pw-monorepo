import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Globe, Eye, Users, Search, MapPin, Languages } from 'lucide-react';
import { SettingRow } from './shared/SettingRow';

// Компонент общих настроек
export function GeneralSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Общие настройки
        </h2>
        <p className='text-muted-foreground'>
          Основные параметры и конфигурация блога
        </p>
      </div>

      <Tabs defaultValue='basics' className='w-full'>
        <TabsList>
          <TabsTrigger value='basics'>Основные</TabsTrigger>
          <TabsTrigger value='regional'>Региональные</TabsTrigger>
          <TabsTrigger value='localization'>Локализация</TabsTrigger>
        </TabsList>

        <TabsContent value='basics' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Информация о блоге</CardTitle>
              <CardDescription>Основные данные вашего издания</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='blog-name'>Название блога</Label>
                <Input
                  id='blog-name'
                  defaultValue='BlogDash'
                  onChange={onChangeDetected}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='blog-description'>Описание</Label>
                <Input
                  id='blog-description'
                  defaultValue='Современное издание о технологиях и разработке'
                  onChange={onChangeDetected}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='blog-url'>URL блога</Label>
                <Input
                  id='blog-url'
                  defaultValue='https://blogdash.example.com'
                  onChange={onChangeDetected}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Globe className='size-4' />
                Доступ и видимость
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Eye}
                label='Публичный доступ'
                description='Блог доступен всем пользователям интернета'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Users}
                label='Регистрация читателей'
                description='Разрешить пользователям создавать аккаунты'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Search}
                label='Индексация поисковиками'
                description='Разрешить поисковым сисемам индексировать контент'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='regional' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <MapPin className='size-4' />
                Региональные настройки
              </CardTitle>
              <CardDescription>
                Часовой пояс и региональные параметры
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='timezone'>Часовой пояс</Label>
                <Select
                  defaultValue='europe-moscow'
                  onValueChange={onChangeDetected}
                >
                  <SelectTrigger id='timezone'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='europe-moscow'>
                      Москва (GMT+3)
                    </SelectItem>
                    <SelectItem value='europe-london'>
                      Лондон (GMT+0)
                    </SelectItem>
                    <SelectItem value='america-new-york'>
                      Нью-Йорк (GMT-5)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='date-format'>Формат даты</Label>
                <Select
                  defaultValue='dd-mm-yyyy'
                  onValueChange={onChangeDetected}
                >
                  <SelectTrigger id='date-format'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='dd-mm-yyyy'>ДД.ММ.ГГГГ</SelectItem>
                    <SelectItem value='mm-dd-yyyy'>MM/DD/YYYY</SelectItem>
                    <SelectItem value='yyyy-mm-dd'>YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='time-format'>Формат времени</Label>
                <Select defaultValue='24h' onValueChange={onChangeDetected}>
                  <SelectTrigger id='time-format'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='24h'>24-часовой</SelectItem>
                    <SelectItem value='12h'>12-часовой (AM/PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='localization' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Languages className='size-4' />
                Язык и локализация
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='language'>Язык интерфейса</Label>
                <Select defaultValue='ru' onValueChange={onChangeDetected}>
                  <SelectTrigger id='language'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ru'>Русский</SelectItem>
                    <SelectItem value='en'>English</SelectItem>
                    <SelectItem value='es'>Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <SettingRow
                icon={Languages}
                label='Мультиязычность'
                description='Включить поддержку нескольких языков для контента'
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
