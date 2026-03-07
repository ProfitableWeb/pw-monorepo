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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export function SchemaSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold mb-2'>
          Структурированные данные
        </h2>
        <p className='text-muted-foreground'>
          Schema.org разметка для расширенных сниппетов в поиске
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Schema</CardTitle>
          <CardDescription>
            Разметка статей по стандарту Schema.org
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Включить Article Schema</Label>
              <p className='text-sm text-muted-foreground'>
                Автоматически добавлять структурированные данные к статьям
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <FormField label='Тип статьи' htmlFor='article-type'>
            <Select defaultValue='BlogPosting'>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Article'>Article</SelectItem>
                <SelectItem value='BlogPosting'>Blog Posting</SelectItem>
                <SelectItem value='NewsArticle'>News Article</SelectItem>
                <SelectItem value='TechArticle'>Tech Article</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Включать время прочтения</Label>
              <p className='text-sm text-muted-foreground'>
                Добавлять estimated reading time в schema
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization Schema</CardTitle>
          <CardDescription>
            Информация об организации/авторе блога
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Включить Organization Schema</Label>
              <p className='text-sm text-muted-foreground'>
                Для Knowledge Graph в Google
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <FormField label='Название организации' htmlFor='org-name'>
            <Input
              id='org-name'
              defaultValue='My Tech Blog'
              onChange={onChangeDetected}
            />
          </FormField>

          <FormField label='URL логотипа' htmlFor='org-logo'>
            <Input
              id='org-logo'
              placeholder='https://example.com/logo.png'
              onChange={onChangeDetected}
            />
          </FormField>

          <FormField
            label='Социальные сети'
            htmlFor='org-social'
            description='Через запятую'
          >
            <Input
              id='org-social'
              placeholder='https://twitter.com/myblog, https://github.com/myblog'
              onChange={onChangeDetected}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breadcrumb Schema</CardTitle>
          <CardDescription>
            Разметка хлебных крошек для поисковых результатов
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Включить Breadcrumb Schema</Label>
              <p className='text-sm text-muted-foreground'>
                Отображать навигационную цепочку в поиске
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Person Schema</CardTitle>
          <CardDescription>Информация об авторах</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Добавлять данные авторов</Label>
              <p className='text-sm text-muted-foreground'>
                Включать Person schema для каждого автора
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <Button variant='outline' className='w-full'>
            Управление профилями авторов
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
