import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
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
  Bell,
  Mail,
  Smartphone,
  Calendar,
  MessageSquare,
  Users,
  Activity,
} from 'lucide-react';
import { SettingRow } from './SettingRow';

// Компонент настроек уведомлений
export function NotificationSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Уведомления
        </h2>
        <p className='text-muted-foreground'>Настройка системы оповещений</p>
      </div>

      <Tabs defaultValue='email' className='w-full'>
        <TabsList>
          <TabsTrigger value='email'>Email</TabsTrigger>
          <TabsTrigger value='push'>Push</TabsTrigger>
          <TabsTrigger value='digest'>Дайджесты</TabsTrigger>
        </TabsList>

        <TabsContent value='email' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Mail className='size-4' />
                Email уведомления
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={MessageSquare}
                label='Новые комментарии'
                description='Уведомления о новых комментариях к вашим статьям'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Users}
                label='Активность команды'
                description='Уведомления о действиях других авторов'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Activity}
                label='Системные уведомления'
                description='Важные обновления и изменения системы'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='push' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Bell className='size-4' />
                Push уведомления
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Bell}
                label='Браузерные уведомления'
                description='Показывать уведомления в браузере'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Smartphone}
                label='Мобильные push'
                description='Отправлять push-уведомления на мобильные устройства'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='digest' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Calendar className='size-4' />
                Дайджесты
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Calendar}
                label='Еженедельный дайджест'
                description='Сводка активности за неделю'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Calendar}
                label='Ежемесячный отчет'
                description='Детальная статистика за месяц'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <div className='space-y-2'>
                <Label htmlFor='digest-day'>День отправки дайджеста</Label>
                <Select defaultValue='monday' onValueChange={onChangeDetected}>
                  <SelectTrigger id='digest-day'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='monday'>Понедельник</SelectItem>
                    <SelectItem value='friday'>Пятница</SelectItem>
                    <SelectItem value='sunday'>Воскресенье</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
