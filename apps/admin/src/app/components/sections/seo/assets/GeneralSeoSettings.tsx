import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { FormField } from '@/app/components/ui/form-field';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export function GeneralSeoSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold mb-2'>Общие настройки SEO</h2>
        <p className='text-muted-foreground'>
          Базовые параметры для поисковой оптимизации сайта
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
          <CardDescription>
            Эти данные используются по умолчанию для всех страниц сайта
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <FormField
            label='Заголовок сайта'
            htmlFor='site-title'
            description='Отображается в результатах поиска и в табе браузера (50-60 символов)'
          >
            <Input
              id='site-title'
              defaultValue='Мой технический блог'
              onChange={onChangeDetected}
            />
          </FormField>

          <FormField
            label='Описание сайта'
            htmlFor='site-description'
            description='Meta description для главной страницы (150-160 символов)'
          >
            <Textarea
              id='site-description'
              defaultValue='Блог о веб-разработке, React, TypeScript и современных технологиях'
              onChange={onChangeDetected}
              rows={3}
            />
          </FormField>

          <FormField
            label='Ключевые слова'
            htmlFor='keywords'
            description='Через запятую (опционально, современные поисковики не используют этот тег активно)'
          >
            <Input
              id='keywords'
              defaultValue='react, typescript, веб-разработка, javascript'
              onChange={onChangeDetected}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Graph</CardTitle>
          <CardDescription>
            Настройки для социальных сетей (Facebook, LinkedIn, и др.)
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <FormField label='OG заголовок' htmlFor='og-title'>
            <Input
              id='og-title'
              placeholder='Мой технический блог'
              onChange={onChangeDetected}
            />
          </FormField>

          <FormField label='OG описание' htmlFor='og-description'>
            <Textarea
              id='og-description'
              placeholder='Статьи о веб-разработке и современных технологиях'
              onChange={onChangeDetected}
              rows={2}
            />
          </FormField>

          <FormField
            label='OG изображение (URL)'
            htmlFor='og-image'
            description='Рекомендуется 1200x630px'
          >
            <Input
              id='og-image'
              placeholder='https://example.com/og-image.jpg'
              onChange={onChangeDetected}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Twitter Cards</CardTitle>
          <CardDescription>
            Настройки для отображения в Twitter/X
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <FormField label='Twitter username' htmlFor='twitter-handle'>
            <Input
              id='twitter-handle'
              placeholder='@myblog'
              onChange={onChangeDetected}
            />
          </FormField>

          <FormField label='Тип карточки' htmlFor='twitter-card'>
            <Select defaultValue='summary_large_image'>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='summary'>Summary</SelectItem>
                <SelectItem value='summary_large_image'>
                  Summary Large Image
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </CardContent>
      </Card>
    </div>
  );
}
