import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
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
  Shield,
  Smartphone,
  Mail,
  Key,
  Activity,
  LogIn,
  Clock,
  Lock,
  Plus,
  Trash2,
  Edit,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Ban,
  Globe2,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { SettingRow } from './SettingRow';

// Компонент настроек безопасности
export function SecuritySettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
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
              {/* Роль администратора */}
              <div className='p-4 rounded-lg border bg-card'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-start gap-3'>
                    <div className='p-2 rounded-lg bg-red-500/10'>
                      <ShieldAlert className='size-4 text-red-500' />
                    </div>
                    <div>
                      <p className='font-medium'>Администратор</p>
                      <p className='text-sm text-muted-foreground'>
                        Полный доступ ко всем функциям системы
                      </p>
                    </div>
                  </div>
                  <Button variant='ghost' size='icon'>
                    <Edit className='size-4' />
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Управление пользователями
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Настройки системы
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Все разделы
                  </Badge>
                </div>
              </div>

              {/* Роль редактора */}
              <div className='p-4 rounded-lg border bg-card'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-start gap-3'>
                    <div className='p-2 rounded-lg bg-blue-500/10'>
                      <ShieldCheck className='size-4 text-blue-500' />
                    </div>
                    <div>
                      <p className='font-medium'>Редактор</p>
                      <p className='text-sm text-muted-foreground'>
                        Управление контентом и публикациями
                      </p>
                    </div>
                  </div>
                  <Button variant='ghost' size='icon'>
                    <Edit className='size-4' />
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Создание статей
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Управление медиа
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Категории и метки
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-red-500/10 text-red-500 border-red-500/20'
                  >
                    <XCircle className='size-3 mr-1' />
                    Настройки системы
                  </Badge>
                </div>
              </div>

              {/* Роль автора */}
              <div className='p-4 rounded-lg border bg-card'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-start gap-3'>
                    <div className='p-2 rounded-lg bg-purple-500/10'>
                      <UserCheck className='size-4 text-purple-500' />
                    </div>
                    <div>
                      <p className='font-medium'>Автор</p>
                      <p className='text-sm text-muted-foreground'>
                        Создание и редактирование собственных статей
                      </p>
                    </div>
                  </div>
                  <Button variant='ghost' size='icon'>
                    <Edit className='size-4' />
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Свои статьи
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Загрузка медиа
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-red-500/10 text-red-500 border-red-500/20'
                  >
                    <XCircle className='size-3 mr-1' />
                    Чужие статьи
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-red-500/10 text-red-500 border-red-500/20'
                  >
                    <XCircle className='size-3 mr-1' />
                    Управление пользователями
                  </Badge>
                </div>
              </div>

              <Button variant='outline' className='w-full'>
                <Plus className='size-4 mr-2' />
                Создать новую роль
              </Button>
            </CardContent>
          </Card>

          {/* IP Access Control */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Globe2 className='size-4' />
                Контроль доступа по IP
              </CardTitle>
              <CardDescription>
                Белые и черные списки IP-адресов
              </CardDescription>
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
                  <div className='flex items-center justify-between p-3 rounded-lg border bg-muted/30'>
                    <div className='flex items-center gap-3'>
                      <Ban className='size-4 text-red-500' />
                      <div>
                        <p className='text-sm font-medium font-mono'>
                          192.168.1.100
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Добавлен 5 фев 2026
                        </p>
                      </div>
                    </div>
                    <Button variant='ghost' size='icon'>
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                  <div className='flex items-center justify-between p-3 rounded-lg border bg-muted/30'>
                    <div className='flex items-center gap-3'>
                      <Ban className='size-4 text-red-500' />
                      <div>
                        <p className='text-sm font-medium font-mono'>
                          10.0.0.55
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Добавлен 3 фев 2026
                        </p>
                      </div>
                    </div>
                    <Button variant='ghost' size='icon'>
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
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

          {/* API Access Tokens */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Key className='size-4' />
                API токены доступа
              </CardTitle>
              <CardDescription>
                Управление токенами для доступа к API
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center justify-between p-4 rounded-lg border bg-card'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='font-medium text-sm'>Основной токен</p>
                      <Badge
                        variant='outline'
                        className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                      >
                        Активен
                      </Badge>
                    </div>
                    <p className='text-xs text-muted-foreground mb-2'>
                      Создан 15 янв 2026 • Полный доступ
                    </p>
                    <code className='text-xs bg-muted px-2 py-1 rounded font-mono'>
                      sk_live_••••••••••••••••••••••abc123
                    </code>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='ghost' size='icon'>
                      <Copy className='size-4' />
                    </Button>
                    <Button variant='ghost' size='icon'>
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </div>

                <div className='flex items-center justify-between p-4 rounded-lg border bg-card'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='font-medium text-sm'>
                        Токен только для чтения
                      </p>
                      <Badge
                        variant='outline'
                        className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                      >
                        Активен
                      </Badge>
                    </div>
                    <p className='text-xs text-muted-foreground mb-2'>
                      Создан 20 янв 2026 • Только чтение
                    </p>
                    <code className='text-xs bg-muted px-2 py-1 rounded font-mono'>
                      sk_live_••••••••••••••••••••••xyz789
                    </code>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='ghost' size='icon'>
                      <Copy className='size-4' />
                    </Button>
                    <Button variant='ghost' size='icon'>
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </div>

                <div className='flex items-center justify-between p-4 rounded-lg border bg-card opacity-60'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='font-medium text-sm'>
                        Тестовый токен (отозван)
                      </p>
                      <Badge
                        variant='outline'
                        className='text-xs bg-red-500/10 text-red-500 border-red-500/20'
                      >
                        Неактивен
                      </Badge>
                    </div>
                    <p className='text-xs text-muted-foreground mb-2'>
                      Создан 10 янв 2026 • Отозван 25 янв 2026
                    </p>
                    <code className='text-xs bg-muted px-2 py-1 rounded font-mono'>
                      sk_test_••••••••••••••••••••••test01
                    </code>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='ghost' size='icon' disabled>
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant='outline' className='w-full'>
                <Plus className='size-4 mr-2' />
                Создать новый токен
              </Button>
            </CardContent>
          </Card>

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
                <Label htmlFor='session-limit'>
                  Максимум одновременных сессий
                </Label>
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

          {/* Журнал безопасности */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Activity className='size-4' />
                Журнал безопасности
              </CardTitle>
              <CardDescription>Последние события безопасности</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex items-start gap-3 p-3 rounded-lg border bg-green-500/5 border-green-500/20'>
                  <CheckCircle className='size-4 text-green-500 mt-0.5' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Успешный вход</p>
                    <p className='text-xs text-muted-foreground'>
                      admin@example.com • 192.168.1.50 • 7 фев 2026, 14:32
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-lg border bg-blue-500/5 border-blue-500/20'>
                  <Key className='size-4 text-blue-500 mt-0.5' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>
                      Создан новый API токен
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      admin@example.com • 7 фев 2026, 12:15
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-lg border bg-yellow-500/5 border-yellow-500/20'>
                  <AlertTriangle className='size-4 text-yellow-500 mt-0.5' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>
                      Изменены права доступа
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      admin@example.com изменил роль user@example.com • 6 фев
                      2026, 18:45
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-lg border bg-red-500/5 border-red-500/20'>
                  <XCircle className='size-4 text-red-500 mt-0.5' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>
                      Неудачная попытка входа
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      unknown@example.com • 10.0.0.55 • 6 фев 2026, 03:22
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-lg border bg-red-500/5 border-red-500/20'>
                  <Ban className='size-4 text-red-500 mt-0.5' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>IP-адрес заблокирован</p>
                    <p className='text-xs text-muted-foreground'>
                      192.168.1.100 • Причина: множественные неудачные попытки •
                      5 фев 2026, 22:10
                    </p>
                  </div>
                </div>
              </div>

              <Button variant='outline' className='w-full mt-4'>
                Посмотреть полный журнал
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
