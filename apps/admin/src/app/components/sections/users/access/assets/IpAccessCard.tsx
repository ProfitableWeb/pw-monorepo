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
import { Trash2, Ban, Plus, Globe2 } from 'lucide-react';
import { BLOCKED_IPS } from '../access-section.constants';

export function IpAccessCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Globe2 className='size-5' />
          Контроль доступа по IP
        </CardTitle>
        <CardDescription>Белые и черные списки IP-адресов</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          <Label>Заблокированные IP-адреса</Label>
          <div className='space-y-2'>
            {BLOCKED_IPS.map(ip => (
              <div
                key={ip.address}
                className='flex items-center justify-between p-3 rounded-lg border bg-muted/30'
              >
                <div className='flex items-center gap-3'>
                  <Ban className='size-4 text-red-500' />
                  <div>
                    <p className='text-sm font-medium font-mono'>
                      {ip.address}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Добавлен {ip.addedDate}
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
