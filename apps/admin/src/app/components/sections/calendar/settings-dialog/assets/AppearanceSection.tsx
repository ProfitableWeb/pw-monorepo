import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';

export function AppearanceSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-4'>Оформление календаря</h3>
        <div className='space-y-4'>
          <div className='space-y-3'>
            <Label>Цветовые схемы событий</Label>

            <div className='space-y-3 border rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded bg-blue-500/30 border-2 border-blue-500' />
                  <div>
                    <div className='text-sm font-medium'>
                      Запланированные статьи
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Основные публикации
                    </div>
                  </div>
                </div>
                <Input
                  type='color'
                  defaultValue='#3b82f6'
                  className='w-16 h-8'
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded bg-purple-500/30 border-2 border-purple-500' />
                  <div>
                    <div className='text-sm font-medium'>AI-предложения</div>
                    <div className='text-xs text-muted-foreground'>
                      Сгенерированные темы
                    </div>
                  </div>
                </div>
                <Input
                  type='color'
                  defaultValue='#a855f7'
                  className='w-16 h-8'
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded bg-green-500/30 border-2 border-green-500' />
                  <div>
                    <div className='text-sm font-medium'>События</div>
                    <div className='text-xs text-muted-foreground'>
                      Вебинары и конференции
                    </div>
                  </div>
                </div>
                <Input
                  type='color'
                  defaultValue='#22c55e'
                  className='w-16 h-8'
                />
              </div>
            </div>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='density'>Плотность отображения</Label>
            <Select defaultValue='comfortable'>
              <SelectTrigger id='density'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='compact'>Компактная</SelectItem>
                <SelectItem value='comfortable'>Комфортная</SelectItem>
                <SelectItem value='spacious'>Просторная</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Показывать время в событиях</Label>
              <p className='text-xs text-muted-foreground'>
                Отображать точное время публикации
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Анимации при переключении</Label>
              <p className='text-xs text-muted-foreground'>
                Плавные переходы между режимами
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
