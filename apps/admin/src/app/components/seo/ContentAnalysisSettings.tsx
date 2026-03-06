import { Eye } from 'lucide-react';
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

export function ContentAnalysisSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold mb-2'>Контент-анализ</h2>
        <p className='text-muted-foreground'>
          Инструменты для оценки и оптимизации контента
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Анализ ключевых слов</CardTitle>
          <CardDescription>
            Автоматическая проверка оптимизации контента
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Включить анализ ключевых слов</Label>
              <p className='text-sm text-muted-foreground'>
                Подсвечивать проблемы с ключевыми словами при создании статьи
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <FormField
            label='Оптимальная плотность ключевых слов (%)'
            htmlFor='keyword-density'
            description='Рекомендуется 1-2%'
          >
            <Input
              id='keyword-density'
              type='number'
              step='0.1'
              defaultValue='1.5'
              onChange={onChangeDetected}
            />
          </FormField>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Предупреждать о переоптимизации</Label>
              <p className='text-sm text-muted-foreground'>
                Слишком высокая плотность ключевых слов
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO-рекомендации</CardTitle>
          <CardDescription>
            Автоматические подсказки по улучшению SEO
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Проверка длины заголовка</Label>
              <p className='text-sm text-muted-foreground'>
                50-60 символов для title
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Проверка длины описания</Label>
              <p className='text-sm text-muted-foreground'>
                150-160 символов для meta description
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Наличие заголовков H2-H3</Label>
              <p className='text-sm text-muted-foreground'>
                Структурированность контента
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Проверка alt-текстов</Label>
              <p className='text-sm text-muted-foreground'>
                Наличие описаний у изображений
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Анализ читабельности</Label>
              <p className='text-sm text-muted-foreground'>
                Flesch Reading Ease Score
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Дубли контента</CardTitle>
          <CardDescription>Проверка на дублирование и плагиат</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Автопроверка на дубли</Label>
              <p className='text-sm text-muted-foreground'>
                Искать похожий контент внутри блога
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <FormField
            label='Порог схожести (%)'
            htmlFor='similarity-threshold'
            description='При превышении будет предупреждение'
          >
            <Input
              id='similarity-threshold'
              type='number'
              defaultValue='30'
              onChange={onChangeDetected}
            />
          </FormField>

          <Button variant='outline' className='w-full'>
            Запустить полную проверку
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Внутренняя перелинковка</CardTitle>
          <CardDescription>Рекомендации по связыванию статей</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Автопредложения ссылок</Label>
              <p className='text-sm text-muted-foreground'>
                Предлагать релевантные статьи для ссылок
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <FormField
            label='Минимум внутренних ссылок'
            htmlFor='min-internal-links'
            description='Рекомендуемое количество ссылок на другие статьи'
          >
            <Input
              id='min-internal-links'
              type='number'
              defaultValue='3'
              onChange={onChangeDetected}
            />
          </FormField>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Проверка анкор-текстов</Label>
              <p className='text-sm text-muted-foreground'>
                Анализировать тексты ссылок
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <Button variant='outline' className='w-full'>
            <Eye className='size-4 mr-2' />
            Карта перелинковки
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Скоринг контента</CardTitle>
          <CardDescription>Общая оценка SEO-качества статей</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Показывать SEO-оценку</Label>
              <p className='text-sm text-muted-foreground'>
                Баллы по 100-балльной шкале
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className='space-y-2'>
            <Label>Топ статей по SEO</Label>
            <div className='space-y-2'>
              <div className='flex items-center justify-between p-2 rounded border'>
                <span className='text-sm'>
                  Полное руководство по React Hooks
                </span>
                <Badge
                  variant='outline'
                  className='bg-green-500/10 text-green-500'
                >
                  95
                </Badge>
              </div>
              <div className='flex items-center justify-between p-2 rounded border'>
                <span className='text-sm'>TypeScript: от новичка до профи</span>
                <Badge
                  variant='outline'
                  className='bg-green-500/10 text-green-500'
                >
                  92
                </Badge>
              </div>
              <div className='flex items-center justify-between p-2 rounded border'>
                <span className='text-sm'>Next.js 14: что нового?</span>
                <Badge
                  variant='outline'
                  className='bg-yellow-500/10 text-yellow-500'
                >
                  78
                </Badge>
              </div>
            </div>
          </div>

          <Button variant='outline' className='w-full'>
            Посмотреть все оценки
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
