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
import { Globe2, CheckCircle, Ban, Trash2, Plus } from 'lucide-react';
import { SettingRow } from './SettingRow';
import { BLOCKED_IPS } from './security-settings.constants';
import type { SecuritySettingsProps } from './security-settings.types';

export function IpAccessControl({ onChangeDetected }: SecuritySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg flex items-center gap-2'>
          <Globe2 className='size-4' />
          Контроль доступа по IP
        </CardTitle>
        <CardDescription>Белые и черные списки IP-адресов</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <SettingRow
          icon={CheckCircle}
          label='IP Whitelist'
          description='Разрешить доступ только с указанных IP-адресов'
          defaultChecked={false}
          onChange={onChangeDetected}
        />
        <Separator />
        <SettingRow
          icon={Ban}
          label='IP Blacklist'
          description='Блокировать доступ с указанных IP-адресов'
          defaultChecked={true}
          onChange={onChangeDetected}
        />
        <Separator />

        <div className='space-y-3'>
          <Label>Заблокированные IP-адреса</Label>
          <div className='space-y-2'>
            {BLOCKED_IPS.map(entry => (
              <div
                key={entry.ip}
                className='flex items-center justify-between p-3 rounded-lg border bg-muted/30'
              >
                <div className='flex items-center gap-3'>
                  <Ban className='size-4 text-red-500' />
                  <div>
                    <p className='text-sm font-medium font-mono'>{entry.ip}</p>
                    <p className='text-xs text-muted-foreground'>
                      {entry.addedDate}
                    </p>
                  </div>
                </div>
                <Button variant='ghost' size='icon'>
                  <Trash2 className='size-4' />
                </Button>
              </div>
            ))}
          </div>
          <div className='flex gap-2'>
            <Input placeholder='Введите IP-адрес...' />
            <Button>
              <Plus className='size-4 mr-2' />
              Добавить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
