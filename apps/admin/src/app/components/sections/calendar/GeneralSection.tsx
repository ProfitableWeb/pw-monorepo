import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';

export function GeneralSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-4'>Общие настройки</h3>
        <div className='space-y-4'>
          <div className='grid gap-2'>
            <Label htmlFor='default-view'>Режим отображения по умолчанию</Label>
            <Select defaultValue='month'>
              <SelectTrigger id='default-view'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='year'>Год</SelectItem>
                <SelectItem value='quarter'>Квартал</SelectItem>
                <SelectItem value='month'>Месяц</SelectItem>
                <SelectItem value='week'>Неделя</SelectItem>
              </SelectContent>
            </Select>
            <p className='text-xs text-muted-foreground'>
              Выберите режим, который будет открываться при загрузке календаря
            </p>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='first-day'>Первый день недели</Label>
            <Select defaultValue='monday'>
              <SelectTrigger id='first-day'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='monday'>Понедельник</SelectItem>
                <SelectItem value='sunday'>Воскресенье</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='time-format'>Формат времени</Label>
            <Select defaultValue='24h'>
              <SelectTrigger id='time-format'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='24h'>24-часовой (14:00)</SelectItem>
                <SelectItem value='12h'>12-часовой (2:00 PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='language'>Язык интерфейса</Label>
            <Select defaultValue='ru'>
              <SelectTrigger id='language'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ru'>Русский</SelectItem>
                <SelectItem value='en'>English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Показывать выходные дни</Label>
              <p className='text-xs text-muted-foreground'>
                Выделять субботу и воскресенье в календаре
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Нумерация недель</Label>
              <p className='text-xs text-muted-foreground'>
                Отображать номера недель в году
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
}
