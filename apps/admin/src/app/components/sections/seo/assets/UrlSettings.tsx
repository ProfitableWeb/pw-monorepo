import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { FormField } from '@/app/components/ui/form-field';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export function UrlSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold mb-2'>URL и редиректы</h2>
        <p className='text-muted-foreground'>
          Настройка структуры URL и управление редиректами
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Структура URL</CardTitle>
          <CardDescription>Формат человекопонятных URL (ЧПУ)</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <FormField
            label='Формат URL статей'
            htmlFor='post-url-structure'
            description='Пример: /2026/02/my-awesome-post'
          >
            <Select defaultValue='date-slug'>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='slug'>/{'{slug}'}</SelectItem>
                <SelectItem value='category-slug'>
                  /{'{category}'}/{'{slug}'}
                </SelectItem>
                <SelectItem value='date-slug'>
                  /{'{year}'}/{'{month}'}/{'{slug}'}
                </SelectItem>
                <SelectItem value='id-slug'>
                  /{'{id}'}-{'{slug}'}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Автогенерация slug</Label>
              <p className='text-sm text-muted-foreground'>
                Создавать URL из заголовка статьи
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Удалять стоп-слова</Label>
              <p className='text-sm text-muted-foreground'>
                Убирать "и", "в", "на" и т.д. из URL
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Транслитерация</Label>
              <p className='text-sm text-muted-foreground'>
                Преобразовывать кириллицу в латиницу
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Canonical URL</CardTitle>
          <CardDescription>
            Предпочтительные версии страниц для поисковиков
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Добавлять canonical теги</Label>
              <p className='text-sm text-muted-foreground'>
                Указывать каноническую версию страницы
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <FormField label='Предпочтительный домен' htmlFor='canonical-domain'>
            <Select defaultValue='https'>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='https'>https://example.com</SelectItem>
                <SelectItem value='https-www'>
                  https://www.example.com
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>301 Редиректы</CardTitle>
              <CardDescription>
                Перенаправление старых URL на новые
              </CardDescription>
            </div>
            <Button size='sm'>Добавить редирект</Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between p-3 rounded-lg border'>
              <div className='flex-1'>
                <p className='text-sm font-medium'>/old-post-url</p>
                <p className='text-xs text-muted-foreground'>
                  → /2026/02/new-post-url
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <Badge variant='outline'>301</Badge>
                <Button variant='ghost' size='sm'>
                  Удалить
                </Button>
              </div>
            </div>

            <div className='flex items-center justify-between p-3 rounded-lg border'>
              <div className='flex-1'>
                <p className='text-sm font-medium'>/category/old-name</p>
                <p className='text-xs text-muted-foreground'>
                  → /category/new-name
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <Badge variant='outline'>301</Badge>
                <Button variant='ghost' size='sm'>
                  Удалить
                </Button>
              </div>
            </div>
          </div>

          <Button variant='outline' className='w-full'>
            Импортировать редиректы из CSV
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trailing Slash</CardTitle>
          <CardDescription>Обработка завершающего слэша в URL</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <FormField label='Политика trailing slash' htmlFor='trailing-slash'>
            <Select defaultValue='no-slash'>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='no-slash'>Без слэша (/page)</SelectItem>
                <SelectItem value='with-slash'>Со слэшем (/page/)</SelectItem>
                <SelectItem value='auto'>Автоматически</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Автоматический редирект</Label>
              <p className='text-sm text-muted-foreground'>
                Перенаправлять на выбранный формат
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
