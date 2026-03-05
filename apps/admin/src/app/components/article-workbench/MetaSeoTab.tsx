import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { FormFieldInput, MiniCheckbox } from '@/app/components/ui/form-field';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { X } from 'lucide-react';
import { LiveCardPreview } from './LiveCardPreview';
import type { ArticleFormData } from '@/app/types/article-editor';

interface MetaSeoTabProps {
  initialData: ArticleFormData;
  onDataChange?: (data: ArticleFormData) => void;
}

const MOCK_CATEGORIES = [
  'Искусственный интеллект',
  'Автоматизация',
  'Рынок труда',
  'Технологии',
  'Образование',
];

function transliterate(text: string): string {
  const map: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };
  return text
    .toLowerCase()
    .split('')
    .map(char => map[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function MetaSeoTab({ initialData, onDataChange }: MetaSeoTabProps) {
  const { register, watch, setValue } = useForm<ArticleFormData>({
    defaultValues: initialData,
  });

  const [autoSlug, setAutoSlug] = useState(true);

  const h1 = watch('h1');
  const title = watch('title');
  const category = watch('category');
  const excerpt = watch('excerpt');
  const tags = watch('tags');
  const imageUrl = watch('imageUrl');

  // Auto-generate slug from H1
  useEffect(() => {
    if (autoSlug && h1) {
      setValue('slug', transliterate(h1));
    }
  }, [autoSlug, h1, setValue]);

  // Notify parent of changes
  useEffect(() => {
    const subscription = watch(data => {
      onDataChange?.(data as ArticleFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      const tag = input.value.trim();
      if (tag && !tags.includes(tag)) {
        setValue('tags', [...tags, tag]);
        input.value = '';
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter(t => t !== tagToRemove)
    );
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 p-8'>
      {/* Form Fields */}
      <div className='space-y-6'>
        <FormFieldInput
          label='Заголовок H1'
          htmlFor='h1'
          hintKnowledgeBaseUrl='/admin/seo/h1'
          hint={
            <>
              <h4>Назначение</h4>
              <p>
                Основной заголовок, отображаемый на странице статьи. Именно его
                видит читатель при открытии материала.
              </p>

              <h4>Рекомендации</h4>
              <ul>
                <li>
                  <strong>Длина:</strong> 40–70 символов
                </li>
                <li>Должен точно отражать содержание статьи</li>
                <li>
                  Допускается эмоциональная окраска и интригующие формулировки
                </li>
                <li>
                  Один <code>&lt;h1&gt;</code> на страницу — обязательное
                  правило
                </li>
              </ul>

              <h4>Отличие от Title</h4>
              <p>
                H1 оптимизирован для <strong>читателя</strong>, Title — для{' '}
                <strong>поисковых систем</strong>. Они могут и должны
                отличаться, когда это помогает SEO.
              </p>
            </>
          }
        >
          <Input
            id='h1'
            placeholder='Заголовок статьи на странице...'
            {...register('h1')}
          />
        </FormFieldInput>

        <FormFieldInput
          label='Title (meta)'
          htmlFor='title'
          hintKnowledgeBaseUrl='/admin/seo/title'
          hint={
            <>
              <h4>Назначение</h4>
              <p>
                Тег <code>&lt;title&gt;</code> — отображается в поисковой выдаче
                и во вкладке браузера. Это первое, что видит пользователь в
                Google/Яндексе.
              </p>

              <h4>Рекомендации</h4>
              <ul>
                <li>
                  <strong>Длина:</strong> 50–60 символов (Google обрезает после
                  ~60)
                </li>
                <li>Ключевые слова — ближе к началу</li>
                <li>
                  Включайте бренд через разделитель:{' '}
                  <code>| ProfitableWeb</code>
                </li>
                <li>Избегайте дублирования с H1 — используйте синонимы</li>
              </ul>

              <h4>CTR-оптимизация</h4>
              <p>
                Добавляйте <strong>цифры</strong>, <strong>год</strong> или{' '}
                <strong>выгоду</strong> — это повышает кликабельность в выдаче
                на 20–30%.
              </p>
            </>
          }
        >
          <Input
            id='title'
            placeholder='Заголовок для поисковой выдачи...'
            {...register('title')}
          />
        </FormFieldInput>

        <FormFieldInput label='Slug (ЧПУ)' htmlFor='slug'>
          <Input
            id='slug'
            placeholder='article-slug'
            className='font-mono text-sm'
            readOnly={autoSlug}
            {...register('slug')}
          />
          <MiniCheckbox
            checked={autoSlug}
            onCheckedChange={setAutoSlug}
            label='Генерировать из заголовка'
          />
        </FormFieldInput>

        <FormFieldInput label='Категория'>
          <Select value={category} onValueChange={v => setValue('category', v)}>
            <SelectTrigger>
              <SelectValue placeholder='Выберите категорию' />
            </SelectTrigger>
            <SelectContent>
              {MOCK_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldInput>

        <FormFieldInput label='Метки'>
          <div className='flex flex-wrap gap-1.5 mb-2'>
            {tags.map(tag => (
              <Badge key={tag} variant='secondary' className='gap-1 pr-1'>
                {tag}
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-4 w-4 hover:bg-transparent'
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X className='h-3 w-3' />
                </Button>
              </Badge>
            ))}
          </div>
          <Input
            placeholder='Введите метку и нажмите Enter...'
            onKeyDown={handleAddTag}
          />
        </FormFieldInput>

        <FormFieldInput label='Краткое описание (Excerpt)' htmlFor='excerpt'>
          <Textarea
            id='excerpt'
            placeholder='Краткое описание для карточки статьи...'
            className='min-h-24'
            {...register('excerpt')}
          />
        </FormFieldInput>
      </div>

      {/* Live Card Preview */}
      <div className='lg:sticky lg:top-6'>
        <LiveCardPreview
          title={h1}
          category={category}
          excerpt={excerpt}
          imageUrl={imageUrl}
          tags={tags}
        />
      </div>
    </div>
  );
}
