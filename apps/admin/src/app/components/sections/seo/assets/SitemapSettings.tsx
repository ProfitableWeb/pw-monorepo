import { CheckCircle, ExternalLink } from 'lucide-react';
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
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import { Badge } from '@/app/components/ui/badge';

export function SitemapSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold mb-2'>Sitemap и Robots.txt</h2>
        <p className='text-muted-foreground'>
          Управление индексацией сайта поисковыми системами
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Sitemap.xml</CardTitle>
              <CardDescription>
                Карта сайта для поисковых систем
              </CardDescription>
            </div>
            <Badge
              variant='outline'
              className='bg-green-500/10 text-green-500 border-green-500/20'
            >
              <CheckCircle className='size-3 mr-1' />
              Активна
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Автообновление</Label>
              <p className='text-sm text-muted-foreground'>
                Обновлять sitemap при публикации контента
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <FormField label='URL sitemap' htmlFor='sitemap-url'>
            <div className='flex gap-2'>
              <Input
                id='sitemap-url'
                defaultValue='https://myblog.com/sitemap.xml'
                readOnly
                className='flex-1'
              />
              <Button variant='outline' size='icon'>
                <ExternalLink className='size-4' />
              </Button>
            </div>
          </FormField>

          <div className='space-y-2'>
            <Label>Включить в sitemap</Label>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Статьи</span>
                <Switch defaultChecked onChange={onChangeDetected} />
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Категории</span>
                <Switch defaultChecked onChange={onChangeDetected} />
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Метки</span>
                <Switch onChange={onChangeDetected} />
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Страницы</span>
                <Switch defaultChecked onChange={onChangeDetected} />
              </div>
            </div>
          </div>

          <Button variant='outline' className='w-full'>
            Сгенерировать sitemap сейчас
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Robots.txt</CardTitle>
          <CardDescription>Правила для поисковых роботов</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <FormField label='Содержимое robots.txt' htmlFor='robots-content'>
            <Textarea
              id='robots-content'
              rows={8}
              defaultValue={`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://myblog.com/sitemap.xml`}
              onChange={onChangeDetected}
              className='font-mono text-sm'
            />
          </FormField>

          <div className='flex gap-2'>
            <Button variant='outline' className='flex-1'>
              Восстановить по умолчанию
            </Button>
            <Button variant='outline' className='flex-1'>
              <ExternalLink className='size-4 mr-2' />
              Просмотр
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Приоритеты и частота</CardTitle>
          <CardDescription>
            Настройки обхода для разных типов страниц
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>Главная страница</p>
                <p className='text-xs text-muted-foreground'>
                  Приоритет: 1.0, Частота: daily
                </p>
              </div>
              <Button variant='ghost' size='sm'>
                Изменить
              </Button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>Статьи</p>
                <p className='text-xs text-muted-foreground'>
                  Приоритет: 0.8, Частота: weekly
                </p>
              </div>
              <Button variant='ghost' size='sm'>
                Изменить
              </Button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>Категории</p>
                <p className='text-xs text-muted-foreground'>
                  Приоритет: 0.6, Частота: weekly
                </p>
              </div>
              <Button variant='ghost' size='sm'>
                Изменить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
