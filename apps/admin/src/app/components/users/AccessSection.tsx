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
import {
  Edit,
  Trash2,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Ban,
  Copy,
  Plus,
  Key,
  UserCheck,
  Globe2,
} from 'lucide-react';
import { Label } from '@/app/components/ui/label';

export function AccessSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Настройка доступа
        </h2>
        <p className='text-muted-foreground'>
          Детальная настройка прав доступа к разделам
        </p>
      </div>

      {/* Роли и разрешения */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <ShieldCheck className='size-5' />
            Роли и разрешения
          </CardTitle>
          <CardDescription>
            Управлеие ролями пользователей и их правами доступа
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Роль администратора */}
          <div className='p-4 rounded-lg border bg-card'>
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-start gap-3'>
                <div className='p-2 rounded-lg bg-red-500/10'>
                  <ShieldAlert className='size-4' />
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
                  <ShieldCheck className='size-4' />
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
                  <UserCheck className='size-4' />
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

      {/* Контроль доступа по IP */}
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
                    <p className='text-sm font-medium font-mono'>10.0.0.55</p>
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

      {/* API токены доступа */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Key className='size-5' />
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
                  <p className='font-medium text-sm'>Токен только для чтения</p>
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

      {/* Журнал безопасности */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='size-5' />
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
                <p className='text-sm font-medium'>Создан новый API токен</p>
                <p className='text-xs text-muted-foreground'>
                  admin@example.com • 7 фев 2026, 12:15
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3 p-3 rounded-lg border bg-yellow-500/5 border-yellow-500/20'>
              <AlertCircle className='size-4 text-yellow-500 mt-0.5' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>Изменены права доступа</p>
                <p className='text-xs text-muted-foreground'>
                  admin@example.com изменил роль user@example.com • 6 фев 2026,
                  18:45
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3 p-3 rounded-lg border bg-red-500/5 border-red-500/20'>
              <XCircle className='size-4 text-red-500 mt-0.5' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>Неудачная попытка входа</p>
                <p className='text-xs text-muted-foreground'>
                  unknown@example.com • 10.0.0.55 • 6 фев 2026, 03:22
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3 p-3 rounded-lg border bg-red-500/5 border-red-500/20'>
              <Ban className='size-4 text-red-500 mt-0.5' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>IP-адрес зблокирован</p>
                <p className='text-xs text-muted-foreground'>
                  192.168.1.100 • Причина: множественные неудачные попытки • 5
                  фев 2026, 22:10
                </p>
              </div>
            </div>
          </div>

          <Button variant='outline' className='w-full mt-4'>
            Посмотреть полный журнал
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
