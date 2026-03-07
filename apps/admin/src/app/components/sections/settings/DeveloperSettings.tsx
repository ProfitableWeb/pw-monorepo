import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
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
  Settings,
  Code,
  Database,
  FileKey,
  Plus,
  Activity,
} from 'lucide-react';
import { SettingRow } from './shared/SettingRow';

// Компонент настроек для разработчиков
export function DeveloperSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Разработчики
        </h2>
        <p className='text-muted-foreground'>
          Настройки API и инструменты для разработчиков
        </p>
      </div>

      <Tabs defaultValue='api' className='w-full'>
        <TabsList>
          <TabsTrigger value='api'>API</TabsTrigger>
          <TabsTrigger value='oauth'>OAuth</TabsTrigger>
          <TabsTrigger value='advanced'>Расширенные</TabsTrigger>
        </TabsList>

        <TabsContent value='api' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Code className='size-4' />
                API доступ
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Database}
                label='REST API'
                description='Включить доступ к REST API'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Database}
                label='GraphQL API'
                description='Включить доступ к GraphQL API'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <div className='space-y-2'>
                <Label htmlFor='rate-limit'>Лимит запросов (в час)</Label>
                <Input
                  id='rate-limit'
                  type='number'
                  defaultValue='1000'
                  onChange={onChangeDetected}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='oauth' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <FileKey className='size-4' />
                OAuth приложения
              </CardTitle>
              <CardDescription>Управление OAuth приложениями</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='text-center py-8 text-muted-foreground'>
                <p className='mb-4'>Нет зарегистрированных OAuth приложений</p>
                <Button variant='outline'>
                  <Plus className='size-4 mr-2' />
                  Создать приложение
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='advanced' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Settings className='size-4' />
                Расширенные настройки
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Activity}
                label='Режим отладки'
                description='Включить детальное логирование для разработки'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Database}
                label='Экспорт данных'
                description='Разрешить экспорт всех данных через API'
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
