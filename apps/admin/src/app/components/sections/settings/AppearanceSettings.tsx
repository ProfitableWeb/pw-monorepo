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
import {
  Palette,
  Paintbrush,
  Sparkles,
  Box,
  Image as ImageIcon,
  Type,
  Code,
} from 'lucide-react';
import { SettingRow } from './SettingRow';

// Компонент настроек внешнего вида
export function AppearanceSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Внешний вид
        </h2>
        <p className='text-muted-foreground'>
          Настройка визуального оформления блога
        </p>
      </div>

      <Tabs defaultValue='theme' className='w-full'>
        <TabsList>
          <TabsTrigger value='theme'>Тема</TabsTrigger>
          <TabsTrigger value='branding'>Брендинг</TabsTrigger>
          <TabsTrigger value='customization'>Кастомизация</TabsTrigger>
        </TabsList>

        <TabsContent value='theme' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Palette className='size-4' />
                Цветовая тема
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label>Тема по умолчанию</Label>
                <Select defaultValue='light' onValueChange={onChangeDetected}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>Светлая</SelectItem>
                    <SelectItem value='dark'>Темная</SelectItem>
                    <SelectItem value='system'>Системная</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <SettingRow
                icon={Paintbrush}
                label='Разрешить переключение темы'
                description='Пользователи могут выбирать тему'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='branding' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Sparkles className='size-4' />
                Брендинг
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={ImageIcon}
                label='Кастомный логотип'
                description='Использовать загруженный логотип вместо названия'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={ImageIcon}
                label='Фавикон'
                description='Собственная иконка для вкладки бразера'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <div className='space-y-2'>
                <Label htmlFor='accent-color'>Акцентный цвет</Label>
                <div className='flex gap-2'>
                  <Input
                    id='accent-color'
                    type='color'
                    defaultValue='#3b82f6'
                    className='w-20 h-10'
                    onChange={onChangeDetected}
                  />
                  <Input
                    defaultValue='#3b82f6'
                    className='flex-1'
                    onChange={onChangeDetected}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='customization' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Box className='size-4' />
                Кастомизация
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Type}
                label='Кастомные шрифты'
                description='Использовать собственные шрифты для заголовков и текста'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Code}
                label='Пользовательский CSS'
                description='Добавить собственные стили CSS'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Code}
                label='Пользовательский JavaScript'
                description='Добавить собственные скрипты'
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
