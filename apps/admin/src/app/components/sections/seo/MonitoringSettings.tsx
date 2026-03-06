import {
  ExternalLink,
  CheckCircle,
  AlertCircle,
  TrendingDown,
} from 'lucide-react';
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

export function MonitoringSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold mb-2'>Мониторинг и аналитика</h2>
        <p className='text-muted-foreground'>
          Отслеживание SEO-метрик и индексации
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Google Search Console</CardTitle>
          <CardDescription>
            Интеграция с инструментами вебмастера Google
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <FormField
            label='Код подтверждения GSC'
            htmlFor='gsc-verification'
            description='Вставьте код верификации из Google Search Console'
          >
            <Input
              id='gsc-verification'
              placeholder='google-site-verification=XXXXXXXXXX'
              onChange={onChangeDetected}
            />
          </FormField>

          <Button variant='outline' className='w-full'>
            <ExternalLink className='size-4 mr-2' />
            Открыть Search Console
          </Button>

          <div className='grid grid-cols-3 gap-4 pt-4'>
            <div className='text-center'>
              <p className='text-2xl font-bold'>156</p>
              <p className='text-xs text-muted-foreground'>Страниц</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold'>12.4K</p>
              <p className='text-xs text-muted-foreground'>Кликов</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold'>89K</p>
              <p className='text-xs text-muted-foreground'>Показов</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Статус индексации</CardTitle>
          <CardDescription>
            Текущее состояние индексации страниц
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between p-3 rounded-lg border'>
              <div className='flex items-center gap-3'>
                <CheckCircle className='size-5 text-green-500' />
                <div>
                  <p className='text-sm font-medium'>Проиндексировано</p>
                  <p className='text-xs text-muted-foreground'>142 страницы</p>
                </div>
              </div>
              <Badge
                variant='outline'
                className='bg-green-500/10 text-green-500'
              >
                91%
              </Badge>
            </div>

            <div className='flex items-center justify-between p-3 rounded-lg border'>
              <div className='flex items-center gap-3'>
                <AlertCircle className='size-5 text-yellow-500' />
                <div>
                  <p className='text-sm font-medium'>В очереди</p>
                  <p className='text-xs text-muted-foreground'>8 страниц</p>
                </div>
              </div>
              <Badge
                variant='outline'
                className='bg-yellow-500/10 text-yellow-500'
              >
                5%
              </Badge>
            </div>

            <div className='flex items-center justify-between p-3 rounded-lg border'>
              <div className='flex items-center gap-3'>
                <TrendingDown className='size-5 text-red-500' />
                <div>
                  <p className='text-sm font-medium'>Ошибки</p>
                  <p className='text-xs text-muted-foreground'>6 страниц</p>
                </div>
              </div>
              <Badge variant='outline' className='bg-red-500/10 text-red-500'>
                4%
              </Badge>
            </div>
          </div>

          <Button variant='outline' className='w-full'>
            Запросить переиндексацию
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Отслеживание позиций</CardTitle>
          <CardDescription>Мониторинг рейтинга ключевых слов</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Включить мониторинг позиций</Label>
              <p className='text-sm text-muted-foreground'>
                Отслеживать изменения в поисковой выдаче
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className='space-y-2'>
            <Label>Топ ключевых слов</Label>
            <div className='space-y-2'>
              <div className='flex items-center justify-between p-2 rounded border'>
                <span className='text-sm'>react хуки</span>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>Позиция 3</Badge>
                  <span className='text-xs text-green-500'>↑ 2</span>
                </div>
              </div>
              <div className='flex items-center justify-between p-2 rounded border'>
                <span className='text-sm'>typescript гайд</span>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>Позиция 7</Badge>
                  <span className='text-xs text-green-500'>↑ 1</span>
                </div>
              </div>
              <div className='flex items-center justify-between p-2 rounded border'>
                <span className='text-sm'>веб-разработка</span>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>Позиция 12</Badge>
                  <span className='text-xs text-red-500'>↓ 3</span>
                </div>
              </div>
            </div>
          </div>

          <Button variant='outline' className='w-full'>
            Добавить ключевые слова
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
