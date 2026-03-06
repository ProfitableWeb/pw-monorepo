/**
 * Вкладка «SEO» — управление мета-данными, slug, ключевыми словами, автором.
 *
 * Секции (аккордеон):
 * - Основные мета-поля (title, description, slug, keywords, автор)
 * - SERP Preview — как статья выглядит в поисковой выдаче Google
 * - Open Graph / Telegram Preview — превью при шеринге
 * - JSON-LD — структурированные данные для поисковиков
 * - SEO Score Bar — визуальная оценка заполненности SEO-полей
 *
 * Авто-slug: транслитерация H1 → латиница через `transliterate()`.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { FormFieldInput, MiniCheckbox } from '@/app/components/ui/form-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/app/components/ui/accordion';
import { X } from 'lucide-react';
import type { ArticleFormData } from '@/app/types/article-editor';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { CharCounter } from './CharCounter';
import { SeoScoreBar } from './SeoScoreBar';
import { SerpPreview } from './SerpPreview';
import { TelegramPreview } from './TelegramPreview';
import { JsonLdPreview } from './JsonLdPreview';
import { transliterate, EDITORIAL_TEAM } from './seo.utils';

interface SeoTabProps {
  register: UseFormRegister<ArticleFormData>;
  watch: UseFormWatch<ArticleFormData>;
  setValue: UseFormSetValue<ArticleFormData>;
}

export function SeoTab({ register, watch, setValue }: SeoTabProps) {
  const [autoSlug, setAutoSlug] = useState(true);
  const [keywordInput, setKeywordInput] = useState('');
  const keywordInputRef = useRef<HTMLInputElement>(null);
  const [authorPopoverOpen, setAuthorPopoverOpen] = useState(false);
  const [authorHighlightedIndex, setAuthorHighlightedIndex] = useState(-1);
  const authorInputRef = useRef<HTMLInputElement>(null);

  const h1 = watch('h1');
  const title = watch('title');
  const slug = watch('slug');
  const metaDescription = watch('metaDescription');
  const imageUrl = watch('imageUrl');
  const ogTitle = watch('ogTitle');
  const ogDescription = watch('ogDescription');
  const ogImage = watch('ogImage');
  const focusKeyword = watch('focusKeyword');
  const seoKeywords = watch('seoKeywords');
  const schemaType = watch('schemaType');
  const author = watch('author');
  const category = watch('category');
  const tags = watch('tags');
  const robotsNoIndex = watch('robotsNoIndex');
  const robotsNoFollow = watch('robotsNoFollow');

  // Auto-generate slug from H1
  useEffect(() => {
    if (autoSlug && h1) {
      setValue('slug', transliterate(h1));
    }
  }, [autoSlug, h1, setValue]);

  // SEO checks
  const seoChecks = useMemo(() => {
    const kw = focusKeyword.toLowerCase().trim();
    return [
      { label: 'Фокус-запрос задан', passed: kw.length > 0 },
      {
        label: 'Фокус-запрос в Title',
        passed: kw.length > 0 && title.toLowerCase().includes(kw),
      },
      {
        label: 'Фокус-запрос в Description',
        passed: kw.length > 0 && metaDescription.toLowerCase().includes(kw),
      },
      {
        label: 'Фокус-запрос в Slug',
        passed:
          kw.length > 0 &&
          slug.toLowerCase().includes(transliterate(kw).slice(0, 15)),
      },
      {
        label: 'Title: 50–60 символов',
        passed: title.length >= 50 && title.length <= 60,
      },
      {
        label: 'Description: 150–160 символов',
        passed: metaDescription.length >= 150 && metaDescription.length <= 160,
      },
      { label: 'Изображение задано', passed: Boolean(imageUrl || ogImage) },
      { label: 'Slug задан', passed: slug.length > 0 && slug.length <= 80 },
    ];
  }, [focusKeyword, title, metaDescription, slug, imageUrl, ogImage]);

  // Effective OG values (with fallbacks)
  const effectiveOgTitle = ogTitle || title;
  const effectiveOgDesc = ogDescription || metaDescription;
  const effectiveOgImage = ogImage || imageUrl;

  // Keyword management
  const addKeyword = (kw: string) => {
    const trimmed = kw.trim();
    if (trimmed && !seoKeywords.includes(trimmed)) {
      setValue('seoKeywords', [...seoKeywords, trimmed]);
    }
    setKeywordInput('');
    keywordInputRef.current?.focus();
  };

  const removeKeyword = (kw: string) => {
    setValue(
      'seoKeywords',
      seoKeywords.filter(k => k !== kw)
    );
  };

  // Author autocomplete
  const authorSuggestions = author.trim()
    ? EDITORIAL_TEAM.filter(
        name =>
          name.toLowerCase().includes(author.toLowerCase()) && name !== author
      )
    : EDITORIAL_TEAM.filter(name => name !== author);

  const selectAuthor = (name: string) => {
    setValue('author', name);
    setAuthorPopoverOpen(false);
    setAuthorHighlightedIndex(-1);
    authorInputRef.current?.focus();
  };

  const handleAuthorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (authorPopoverOpen && authorSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAuthorHighlightedIndex(i =>
          i < authorSuggestions.length - 1 ? i + 1 : 0
        );
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAuthorHighlightedIndex(i =>
          i > 0 ? i - 1 : authorSuggestions.length - 1
        );
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const author =
          authorHighlightedIndex >= 0
            ? authorSuggestions[authorHighlightedIndex]
            : undefined;
        if (author) selectAuthor(author);
        return;
      }
    }
    if (e.key === 'Escape') {
      setAuthorPopoverOpen(false);
      setAuthorHighlightedIndex(-1);
    }
  };

  return (
    <div className='flex flex-col h-full min-h-0'>
      {/* SEO Score Bar — pinned */}
      <SeoScoreBar checks={seoChecks} />

      {/* Scrollable content */}
      <ScrollArea className='flex-1 min-h-0'>
        <div className='grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 p-8'>
          {/* Left: Form */}
          <div className='space-y-6 min-w-0'>
            {/* Section: Search Engines (always open) */}
            <div className='space-y-5'>
              <h3 className='text-sm font-semibold text-foreground'>
                Поисковые системы
              </h3>

              <FormFieldInput
                label='Фокус-запрос'
                htmlFor='focusKeyword'
                hint={
                  <>
                    <h4>Назначение</h4>
                    <p>
                      Основное ключевое слово или фраза, под которую
                      оптимизирована статья. Используется для SEO-анализа:
                      проверяется наличие в title, description, slug.
                    </p>
                    <h4>Рекомендации</h4>
                    <ul>
                      <li>Одна основная фраза, 2–4 слова</li>
                      <li>Должна отражать поисковый запрос пользователя</li>
                      <li>Естественно входить в заголовок и описание</li>
                    </ul>
                  </>
                }
              >
                <Input
                  id='focusKeyword'
                  placeholder='Основной ключевой запрос...'
                  {...register('focusKeyword')}
                />
              </FormFieldInput>

              <FormFieldInput
                label='SEO Title'
                htmlFor='seo-title'
                hintKnowledgeBaseUrl='/admin/seo/title'
                hint={
                  <>
                    <h4>Назначение</h4>
                    <p>
                      Тег <code>&lt;title&gt;</code> — отображается в поисковой
                      выдаче и во вкладке браузера.
                    </p>
                    <h4>Рекомендации</h4>
                    <ul>
                      <li>
                        <strong>Длина:</strong> 50–60 символов
                      </li>
                      <li>Ключевые слова — ближе к началу</li>
                      <li>
                        Бренд через разделитель: <code>| ProfitableWeb</code>
                      </li>
                    </ul>
                  </>
                }
              >
                <div className='group/field'>
                  <Input
                    id='seo-title'
                    placeholder='Заголовок для поисковой выдачи...'
                    {...register('title')}
                  />
                  <CharCounter value={title} min={50} max={60} focusOnly />
                </div>
              </FormFieldInput>

              <FormFieldInput
                label='Meta Description'
                htmlFor='metaDescription'
                hint={
                  <>
                    <h4>Назначение</h4>
                    <p>
                      Тег <code>&lt;meta name=&quot;description&quot;&gt;</code>{' '}
                      — краткое описание в поисковой выдаче под заголовком.
                    </p>
                    <h4>Рекомендации</h4>
                    <ul>
                      <li>
                        <strong>Длина:</strong> 150–160 символов
                      </li>
                      <li>Ключевые слова естественным образом</li>
                      <li>Призыв к действию повышает CTR</li>
                    </ul>
                  </>
                }
              >
                <div className='group/field'>
                  <Textarea
                    id='metaDescription'
                    placeholder='Описание для поисковой выдачи...'
                    className='min-h-20'
                    {...register('metaDescription')}
                  />
                  <CharCounter
                    value={metaDescription}
                    min={150}
                    max={160}
                    focusOnly
                  />
                </div>
              </FormFieldInput>

              <FormFieldInput label='Slug (ЧПУ)' htmlFor='seo-slug'>
                <Input
                  id='seo-slug'
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
            </div>

            {/* Collapsible sections */}
            <Accordion type='multiple' className='border-t'>
              {/* Social */}
              <AccordionItem value='social'>
                <AccordionTrigger className='py-3 hover:no-underline'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>Соцсети</span>
                    <span className='text-xs text-muted-foreground font-normal'>
                      Open Graph для Telegram, VK, Facebook
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='space-y-5 pt-2'>
                  <FormFieldInput label='OG Title' htmlFor='ogTitle'>
                    <Input
                      id='ogTitle'
                      placeholder={title || 'Используется SEO Title...'}
                      {...register('ogTitle')}
                    />
                  </FormFieldInput>

                  <FormFieldInput
                    label='OG Description'
                    htmlFor='ogDescription'
                  >
                    <Textarea
                      id='ogDescription'
                      placeholder={
                        metaDescription || 'Используется Meta Description...'
                      }
                      className='min-h-16'
                      {...register('ogDescription')}
                    />
                  </FormFieldInput>

                  <FormFieldInput
                    label='OG Image'
                    htmlFor='ogImage'
                    hint={
                      <>
                        <h4>Рекомендации</h4>
                        <ul>
                          <li>
                            <strong>Размер:</strong> 1200 × 630 px (1.91:1)
                          </li>
                          <li>Формат: JPG или PNG, до 5 МБ</li>
                        </ul>
                        <h4>Если не задан</h4>
                        <p>Используется обложка статьи.</p>
                      </>
                    }
                  >
                    <Input
                      id='ogImage'
                      placeholder={imageUrl || 'Используется обложка статьи...'}
                      className='font-mono text-sm'
                      {...register('ogImage')}
                    />
                  </FormFieldInput>
                </AccordionContent>
              </AccordionItem>

              {/* Technical SEO */}
              <AccordionItem value='technical'>
                <AccordionTrigger className='py-3 hover:no-underline'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>Техническое SEO</span>
                    <span className='text-xs text-muted-foreground font-normal'>
                      canonical, robots
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='space-y-5 pt-2'>
                  <FormFieldInput
                    label='Canonical URL'
                    htmlFor='canonicalUrl'
                    hint={
                      <>
                        <h4>Назначение</h4>
                        <p>
                          Тег{' '}
                          <code>&lt;link rel=&quot;canonical&quot;&gt;</code> —
                          указывает основной URL страницы.
                        </p>
                        <h4>Если не задан</h4>
                        <p>
                          Генерируется:{' '}
                          <code>https://profitableweb.ru/{'{slug}'}</code>
                        </p>
                      </>
                    }
                  >
                    <Input
                      id='canonicalUrl'
                      placeholder={
                        slug
                          ? `https://profitableweb.ru/${slug}`
                          : 'https://profitableweb.ru/...'
                      }
                      className='font-mono text-sm'
                      {...register('canonicalUrl')}
                    />
                  </FormFieldInput>

                  <div className='space-y-2'>
                    <p className='pl-1 text-xs font-medium text-muted-foreground'>
                      Robots
                    </p>
                    <div className='flex gap-6'>
                      <MiniCheckbox
                        checked={robotsNoIndex}
                        onCheckedChange={v => setValue('robotsNoIndex', v)}
                        label='noindex'
                      />
                      <MiniCheckbox
                        checked={robotsNoFollow}
                        onCheckedChange={v => setValue('robotsNoFollow', v)}
                        label='nofollow'
                      />
                    </div>
                    {(robotsNoIndex || robotsNoFollow) && (
                      <p className='text-[11px] text-amber-500 pl-1'>
                        {robotsNoIndex && 'Страница не будет индексироваться. '}
                        {robotsNoFollow &&
                          'Ссылки на странице не будут учитываться.'}
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Structured Data */}
              <AccordionItem value='structured'>
                <AccordionTrigger className='py-3 hover:no-underline'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>
                      Структурированные данные
                    </span>
                    <span className='text-xs text-muted-foreground font-normal'>
                      schema.org, JSON-LD
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='space-y-5 pt-2'>
                  <FormFieldInput
                    label='Schema Type'
                    hint={
                      <>
                        <h4>Типы</h4>
                        <ul>
                          <li>
                            <strong>BlogPosting</strong> — стандартный пост в
                            блоге
                          </li>
                          <li>
                            <strong>TechArticle</strong> — техническая/IT статья
                          </li>
                          <li>
                            <strong>NewsArticle</strong> — новостная статья
                          </li>
                          <li>
                            <strong>ScholarlyArticle</strong> —
                            научная/исследовательская
                          </li>
                        </ul>
                      </>
                    }
                  >
                    <Select
                      value={schemaType}
                      onValueChange={v => setValue('schemaType', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Тип контента' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='BlogPosting'>BlogPosting</SelectItem>
                        <SelectItem value='TechArticle'>TechArticle</SelectItem>
                        <SelectItem value='NewsArticle'>NewsArticle</SelectItem>
                        <SelectItem value='ScholarlyArticle'>
                          ScholarlyArticle
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormFieldInput>

                  <FormFieldInput label='Автор' htmlFor='author'>
                    <div className='relative'>
                      <Input
                        ref={authorInputRef}
                        id='author'
                        placeholder='Автор статьи...'
                        value={author}
                        onChange={e => {
                          setValue('author', e.target.value);
                          setAuthorPopoverOpen(true);
                          setAuthorHighlightedIndex(-1);
                        }}
                        onFocus={() => setAuthorPopoverOpen(true)}
                        onBlur={() => {
                          setTimeout(() => setAuthorPopoverOpen(false), 150);
                        }}
                        onKeyDown={handleAuthorKeyDown}
                      />
                      {authorPopoverOpen && authorSuggestions.length > 0 && (
                        <div className='absolute z-50 top-full left-0 right-0 mt-1 rounded-md border bg-popover p-1 shadow-md'>
                          <div className='max-h-48 overflow-y-auto'>
                            {authorSuggestions.map((name, idx) => (
                              <button
                                key={name}
                                type='button'
                                className={`w-full text-left px-2.5 py-1.5 text-sm rounded-sm transition-colors cursor-pointer ${idx === authorHighlightedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                                onMouseDown={e => {
                                  e.preventDefault();
                                  selectAuthor(name);
                                }}
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </FormFieldInput>

                  <FormFieldInput
                    label='Ключевые слова (keywords)'
                    hint={
                      <>
                        <h4>Назначение</h4>
                        <p>
                          Ключевые слова для <code>schema.org keywords</code> и
                          мета-тега{' '}
                          <code>&lt;meta name=&quot;keywords&quot;&gt;</code>.
                          Дополняют основные теги статьи для SEO.
                        </p>
                      </>
                    }
                  >
                    <Input
                      ref={keywordInputRef}
                      placeholder='Введите и нажмите Enter...'
                      value={keywordInput}
                      onChange={e => setKeywordInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addKeyword(keywordInput);
                        }
                      }}
                    />
                    {seoKeywords.length > 0 && (
                      <div className='flex flex-wrap gap-1.5 mt-2'>
                        {seoKeywords.map(kw => (
                          <Badge
                            key={kw}
                            variant='secondary'
                            className='gap-1 pr-1'
                          >
                            {kw}
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-4 w-4 hover:bg-transparent'
                              onClick={() => removeKeyword(kw)}
                              type='button'
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    {tags.length > 0 && seoKeywords.length === 0 && (
                      <p className='text-[11px] text-muted-foreground pl-1'>
                        По умолчанию используются теги статьи: {tags.join(', ')}
                      </p>
                    )}
                  </FormFieldInput>
                </AccordionContent>
              </AccordionItem>

              {/* JSON-LD Preview */}
              <AccordionItem value='jsonld'>
                <AccordionTrigger className='py-3 hover:no-underline'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>JSON-LD</span>
                    <span className='text-xs text-muted-foreground font-normal'>
                      разметка schema.org
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='pt-2'>
                  <JsonLdPreview
                    schemaType={schemaType}
                    title={title}
                    description={metaDescription}
                    slug={slug}
                    author={author}
                    keywords={seoKeywords.length > 0 ? seoKeywords : tags}
                    imageUrl={effectiveOgImage}
                    category={category}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Right: Live Previews */}
          <div className='space-y-6'>
            <SerpPreview
              title={title}
              slug={slug}
              description={metaDescription}
            />

            <TelegramPreview
              title={effectiveOgTitle}
              description={effectiveOgDesc}
              imageUrl={effectiveOgImage}
              onImageUpload={file => {
                const url = URL.createObjectURL(file);
                setValue('ogImage', url);
              }}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
