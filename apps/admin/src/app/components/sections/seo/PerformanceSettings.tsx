import { ExternalLink, CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { FormField } from '@/app/components/ui/form-field';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Badge } from '@/app/components/ui/badge';

export function PerformanceSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold mb-2'>Производительность</h2>
        <p className='text-muted-foreground'>
          Оптимизация скорости загрузки и Core Web Vitals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
          <CardDescription>
            Ключевые метрики производительности Google
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-3 gap-4'>
            <div className='text-center p-4 rounded-lg border'>
              <p className='text-xs text-muted-foreground mb-2'>LCP</p>
              <p className='text-2xl font-bold text-green-500'>1.8s</p>
              <p className='text-xs text-muted-foreground mt-1'>Хорошо</p>
            </div>
            <div className='text-center p-4 rounded-lg border'>
              <p className='text-xs text-muted-foreground mb-2'>FID</p>
              <p className='text-2xl font-bold text-green-500'>45ms</p>
              <p className='text-xs text-muted-foreground mt-1'>Хорошо</p>
            </div>
            <div className='text-center p-4 rounded-lg border'>
              <p className='text-xs text-muted-foreground mb-2'>CLS</p>
              <p className='text-2xl font-bold text-yellow-500'>0.12</p>
              <p className='text-xs text-muted-foreground mt-1'>Средне</p>
            </div>
          </div>

          <Button variant='outline' className='w-full'>
            <ExternalLink className='size-4 mr-2' />
            PageSpeed Insights
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Оптимизация изображений</CardTitle>
          <CardDescription>
            Автоматическое сжатие и оптимизация медиафайлов
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Автосжатие изображений</Label>
              <p className='text-sm text-muted-foreground'>
                Сжимать изображения при загрузке
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Конвертация в WebP</Label>
              <p className='text-sm text-muted-foreground'>
                Преобразовывать изображения в формат WebP
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Lazy loading</Label>
              <p className='text-sm text-muted-foreground'>
                Отложенная загрузка изображений
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <FormField label='Качество сжатия' htmlFor='image-quality'>
            <Input
              id='image-quality'
              type='number'
              min='1'
              max='100'
              defaultValue='85'
              onChange={onChangeDetected}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Кэширование</CardTitle>
          <CardDescription>
            Настройки кэширования для ускорения загрузки
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Браузерное кэширование</Label>
              <p className='text-sm text-muted-foreground'>
                Cache-Control заголовки
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <FormField label='Время кэширования (дни)' htmlFor='cache-duration'>
            <Input
              id='cache-duration'
              type='number'
              defaultValue='30'
              onChange={onChangeDetected}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Мобильная оптимизация</CardTitle>
          <CardDescription>Настройки для мобильных устройств</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Адаптивные изображения</Label>
              <p className='text-sm text-muted-foreground'>
                Разные размеры для разных устройств
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className='flex items-center justify-between p-3 rounded-lg border'>
            <div>
              <p className='text-sm font-medium'>Mobile-Friendly тест</p>
              <p className='text-xs text-muted-foreground'>
                Последняя проверка: 2 дня назад
              </p>
            </div>
            <Badge variant='outline' className='bg-green-500/10 text-green-500'>
              <CheckCircle className='size-3 mr-1' />
              Passed
            </Badge>
          </div>

          <Button variant='outline' className='w-full'>
            Запустить тест
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
