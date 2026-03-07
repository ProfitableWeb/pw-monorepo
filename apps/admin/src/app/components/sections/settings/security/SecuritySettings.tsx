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
  Shield,
  Smartphone,
  Mail,
  Key,
  Activity,
  LogIn,
  Clock,
} from 'lucide-react';
import { SettingRow } from '../shared/SettingRow';
import { AccessControlTab } from './assets/AccessControlTab';
import type { SecuritySettingsProps } from './security-settings.types';

// Компонент настроек безопасности
export function SecuritySettings({ onChangeDetected }: SecuritySettingsProps) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Безопасность
        </h2>
        <p className='text-muted-foreground'>
          Параметры защиты и контроля доступа
        </p>
      </div>

      <Tabs defaultValue='authentication' className='w-full'>
        <TabsList>
          <TabsTrigger value='authentication'>Аутентификация</TabsTrigger>
          <TabsTrigger value='password'>Пароль</TabsTrigger>
          <TabsTrigger value='sessions'>Сессии</TabsTrigger>
          <TabsTrigger value='access-control'>Настройка доступа</TabsTrigger>
        </TabsList>

        <TabsContent value='authentication' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Shield className='size-4' />
                Двухфакторная аутентификация
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Smartphone}
                label='2FA через приложение'
                description='Использовать приложение-аутентификатор'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Mail}
                label='2FA через email'
                description='Отправлять код подтвеждения на почту'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <LogIn className='size-4' />
                Безопасность входа
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Activity}
                label='История входов'
                description='Отслеживать попытки входа в систему'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Mail}
                label='Уведомления о новых входах'
                description='Email при входе с нового устройства'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='password' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Требования к паролю</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='min-password-length'>
                  Минимальная длина пароля
                </Label>
                <Input
                  id='min-password-length'
                  type='number'
                  defaultValue='8'
                  onChange={onChangeDetected}
                />
              </div>
              <Separator />
              <SettingRow
                icon={Key}
                label='Требовать специальные символы'
                description='Пароль должен содержать спецсимволы'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Key}
                label='Требовать цифры'
                description='Пароль должен содержать цифры'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='sessions' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Clock className='size-4' />
                Управление сессиями
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Clock}
                label='Автовыход при неакивности'
                description='Выход после 30 минут неактивности'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <div className='space-y-2'>
                <Label htmlFor='session-duration'>
                  Длительность сессии (дней)
                </Label>
                <Input
                  id='session-duration'
                  type='number'
                  defaultValue='30'
                  onChange={onChangeDetected}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='access-control' className='space-y-6 mt-6'>
          <AccessControlTab onChangeDetected={onChangeDetected} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
