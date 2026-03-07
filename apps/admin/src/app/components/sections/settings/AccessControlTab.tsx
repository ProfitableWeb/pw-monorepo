import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { ShieldCheck, Lock, Clock, Activity, Plus } from 'lucide-react';
import { SettingRow } from './SettingRow';
import { RoleCard } from './RoleCard';
import { IpAccessControl } from './IpAccessControl';
import { ApiTokenList } from './ApiTokenList';
import { SecurityLogCard } from './SecurityLogCard';
import { ROLES } from './security-settings.constants';
import type { SecuritySettingsProps } from './security-settings.types';

export function AccessControlTab({ onChangeDetected }: SecuritySettingsProps) {
  return (
    <>
      {/* Роли и разрешения */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2'>
            <ShieldCheck className='size-4' />
            Роли и разрешения
          </CardTitle>
          <CardDescription>
            Управление ролями пользователей и их правами доступа
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {ROLES.map(role => (
            <RoleCard key={role.name} role={role} />
          ))}

          <Button variant='outline' className='w-full'>
            <Plus className='size-4 mr-2' />
            Создать новую роль
          </Button>
        </CardContent>
      </Card>

      <IpAccessControl onChangeDetected={onChangeDetected} />

      <ApiTokenList />

      {/* Политики безопасности */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2'>
            <ShieldCheck className='size-4' />
            Политики безопасности
          </CardTitle>
          <CardDescription>Правила доступа и безопасности</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <SettingRow
            icon={Lock}
            label='Требовать 2FA для администраторов'
            description='Обязательная двухфакторная аутентификация для пользователей с ролью Администратор'
            defaultChecked={true}
            onChange={onChangeDetected}
          />
          <Separator />
          <SettingRow
            icon={Clock}
            label='Автоматическая блокировка'
            description='Блокировать аккаунт после 5 неудачных попыток входа'
            defaultChecked={true}
            onChange={onChangeDetected}
          />
          <Separator />
          <SettingRow
            icon={Activity}
            label='Логирование всех действий'
            description='Записывать все действия пользователей в журнал безопасности'
            defaultChecked={true}
            onChange={onChangeDetected}
          />
          <Separator />
          <div className='space-y-2'>
            <Label htmlFor='session-limit'>Максимум одновременных сессий</Label>
            <Select defaultValue='3' onValueChange={onChangeDetected}>
              <SelectTrigger id='session-limit'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>1 устройство</SelectItem>
                <SelectItem value='3'>3 устройства</SelectItem>
                <SelectItem value='5'>5 устройств</SelectItem>
                <SelectItem value='unlimited'>Без ограничений</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <SecurityLogCard />
    </>
  );
}
