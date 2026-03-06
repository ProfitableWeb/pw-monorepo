import { Sparkles, Eye } from 'lucide-react';
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

export function MetaTagsSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold mb-2'>Мета-теги статей</h2>
        <p className='text-muted-foreground'>
          Шаблоны и автоматическая генерация мета-тегов для статей
        </p>
      </div>

      <Card className='border-blue-500/20 bg-blue-500/5'>
        <CardHeader>
          <div className='flex items-start gap-3'>
            <Sparkles className='size-5 text-blue-500 mt-0.5 flex-shrink-0' />
            <div>
              <CardTitle className='text-base'>
                Современный подход к SEO (2024-2026)
              </CardTitle>
              <CardDescription className='mt-2'>
                AI-поисковики (Google Gemini, ChatGPT Search, Perplexity)
                фокусируются на <strong>смысле и качестве контента</strong>, а
                не на формульных шаблонах. Рекомендации:
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='space-y-1.5 text-sm'>
            <p className='flex items-start gap-2'>
              <span className='text-blue-500 mt-0.5'>•</span>
              <span>
                <strong>Приоритет смыслу:</strong> Каждый символ title должен
                работать на привлечение клика и понимание темы
              </span>
            </p>
            <p className='flex items-start gap-2'>
              <span className='text-blue-500 mt-0.5'>•</span>
              <span>
                <strong>Брендинг опционален:</strong> Постфикс "| Название
                сайта" забирает 10-20 символов. Полезен для известных брендов,
                но не критичен для контента
              </span>
            </p>
            <p className='flex items-start gap-2'>
              <span className='text-blue-500 mt-0.5'>•</span>
              <span>
                <strong>Естественный язык:</strong> Пишите для людей, не для
                роботов. AI понимает контекст и намерения
              </span>
            </p>
            <p className='flex items-start gap-2'>
              <span className='text-blue-500 mt-0.5'>•</span>
              <span>
                <strong>Уникальность:</strong> Каждая страница должна иметь
                уникальный, описательный заголовок
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Стратегия заголовков</CardTitle>
          <CardDescription>
            Выберите подход к формированию title тегов
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <FormField label='Подход к title' htmlFor='title-strategy'>
            <Select defaultValue='content-first'>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='content-first'>
                  <div className='flex flex-col items-start'>
                    <span className='font-medium'>
                      Контент-ориентированный (рекомендуется)
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      Пример: "Полное руководство по React Hooks 2024"
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value='branded'>
                  <div className='flex flex-col items-start'>
                    <span className='font-medium'>С брендингом</span>
                    <span className='text-xs text-muted-foreground'>
                      Пример: "Руководство по React Hooks | Мой Блог"
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value='category-branded'>
                  <div className='flex flex-col items-start'>
                    <span className='font-medium'>Категория + бренд</span>
                    <span className='text-xs text-muted-foreground'>
                      Пример: "React: Полное руководство по Hooks | Блог"
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value='custom'>
                  <div className='flex flex-col items-start'>
                    <span className='font-medium'>Свой шаблон</span>
                    <span className='text-xs text-muted-foreground'>
                      Настроить вручную
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label='Шаблон для статей'
            htmlFor='title-template'
            description='Переменные: {title}, {category}, {author}, {site}. Совет: Оставьте только {title} для максимальной релевантности'
          >
            <Input
              id='title-template'
              defaultValue='{title}'
              onChange={onChangeDetected}
            />
          </FormField>

          <FormField label='Шаблон для категорий' htmlFor='category-template'>
            <Input
              id='category-template'
              defaultValue='{category} - статьи и руководства'
              onChange={onChangeDetected}
            />
          </FormField>

          <div className='p-3 rounded-lg border bg-muted/30'>
            <div className='flex items-start gap-2'>
              <Eye className='size-4 text-muted-foreground mt-0.5 flex-shrink-0' />
              <div className='text-xs text-muted-foreground'>
                <strong className='text-foreground'>
                  Зачем добавлять название сайта?
                </strong>
                <br />
                <span className='mt-1 block'>
                  ✓ Брендинг: узнаваемость в результатах поиска
                </span>
                <span className='block'>
                  ✓ Навигация: помогает в табах браузера
                </span>
                <span className='block'>
                  ✗ Забирает ценные символы (лимит 50-60)
                </span>
                <span className='block'>
                  ✗ Может снижать кликабельность (CTR)
                </span>
                <span className='mt-1 block'>
                  <strong>Вывод:</strong> Используйте брендинг для известных
                  брендов или корпоративных блогов. Для контентных проектов
                  лучше фокусироваться на смысле заголовка.
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Автогенерация описаний</CardTitle>
          <CardDescription>
            Автоматическое создание meta description из контента
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Включить автогенерацию</Label>
              <p className='text-sm text-muted-foreground'>
                Создавать описание из первых 150 символов статьи
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <FormField
            label='Длина описания (символов)'
            htmlFor='description-length'
            description='Рекомендуется 120-155 символов. Google может переписать слишком короткие или длинные описания'
          >
            <Input
              id='description-length'
              type='number'
              defaultValue='155'
              onChange={onChangeDetected}
            />
          </FormField>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Добавлять призыв к действию</Label>
              <p className='text-sm text-muted-foreground'>
                "Читать далее", "Узнать больше" в конце описания
              </p>
            </div>
            <Switch onChange={onChangeDetected} />
          </div>

          <div className='p-3 rounded-lg border bg-muted/30'>
            <p className='text-xs text-muted-foreground'>
              <strong className='text-foreground'>Важно:</strong> Meta
              description не влияет на ранжирование напрямую, но улучшает CTR
              (кликабельность). Google часто переписывает описания, показывая
              наиболее релевантный фрагмент. Пишите информативно и убедительно
              для пользователя, а не для алгоритма.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-оптимизация мета-тегов</CardTitle>
          <CardDescription>
            Использовать AI для улучшения SEO-заголовков и описаний
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Включить AI-помощник</Label>
              <p className='text-sm text-muted-foreground'>
                AI предложит варианты заголовков с фокусом на намерение
                пользователя (search intent)
              </p>
            </div>
            <Switch onChange={onChangeDetected} />
          </div>

          <div className='p-3 rounded-lg border bg-blue-500/5 border-blue-500/20'>
            <div className='flex items-start gap-2'>
              <Sparkles className='size-4 text-blue-500 mt-0.5 flex-shrink-0' />
              <div className='text-xs'>
                <strong className='text-foreground'>AI анализирует:</strong>
                <div className='mt-1 space-y-0.5 text-muted-foreground'>
                  <p>• Поисковые запросы и намерения пользователей</p>
                  <p>• Эмоциональную привлекательность заголовка</p>
                  <p>• Конкурентов в поисковой выдаче</p>
                  <p>• Тренды и актуальность темы</p>
                </div>
              </div>
            </div>
          </div>

          <Button variant='outline' className='w-full' disabled>
            <Sparkles className='size-4 mr-2' />
            Настроить AI-модель
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
