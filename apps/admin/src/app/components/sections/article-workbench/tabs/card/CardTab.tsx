/**
 * Вкладка «Карточка» — визуальное редактирование карточки статьи.
 *
 * Левая панель: поля формы (H1, подзаголовок, категория, теги, обложка,
 * excerpt в двух режимах — HTML/WYSIWYG, Monaco-редактор для excerpt-HTML).
 * Правая панель: LiveCardPreview — реальный рендер карточки через iframe.
 *
 * Разделитель между панелями перетаскивается (35–70% ширины).
 *
 * @see LiveCardPreview — iframe-превью с реальным ArticleCard из web-приложения
 */
import { useCallback, useRef, useState } from 'react';
import type {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form';
import { Input } from '@/app/components/ui/input';
import { FormFieldInput } from '@/app/components/ui/form-field';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  X,
  WandSparkles,
  Settings2,
  GripHorizontal,
  GripVertical,
  ImageIcon,
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import * as prettier from 'prettier/standalone';
import htmlPlugin from 'prettier/plugins/html';
import { Label } from '@/app/components/ui/label';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { LiveCardPreview } from '../../preview';
import { MiniWysiwygEditor } from '../../shared';
import {
  EditorSettingsPanel,
  useEditorSettingsPanel,
  defineCustomThemes,
  type EditorTheme,
} from '../../editor-shared';
import type { ArticleFormData } from '@/app/types/article-editor';

type ExcerptMode = 'html' | 'wysiwyg';

interface CardTabProps {
  register: UseFormRegister<ArticleFormData>;
  watch: UseFormWatch<ArticleFormData>;
  setValue: UseFormSetValue<ArticleFormData>;
}

import {
  MOCK_CATEGORIES,
  KNOWN_TAGS,
  MIN_LEFT_PCT,
  MAX_LEFT_PCT,
} from './card.constants';

export function CardTab({ register, watch, setValue }: CardTabProps) {
  const h1 = watch('h1');
  const subtitle = watch('subtitle');
  const category = watch('category');
  const excerpt = watch('excerpt');
  const tags = watch('tags');
  const imageUrl = watch('imageUrl');
  const slug = watch('slug');

  const [tagInput, setTagInput] = useState('');
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const excerptEditorRef = useRef<any>(null);
  const [excerptWordWrap, setExcerptWordWrap] = useState(true);
  const [excerptFontSize, setExcerptFontSize] = useState(13);
  const [excerptMode, setExcerptMode] = useState<ExcerptMode>('html');
  const [excerptHeight, setExcerptHeight] = useState(192);
  const [excerptTheme, setExcerptTheme] = useState<EditorTheme>('vs-dark');
  const [excerptLineNumbers, setExcerptLineNumbers] = useState(true);
  const [excerptMinimap, setExcerptMinimap] = useState(false);
  const excerptSettings = useEditorSettingsPanel();

  // Состояние перетаскиваемого разделителя
  const [leftPct, setLeftPct] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingDivider, setIsDraggingDivider] = useState(false);

  // Состояние drag-and-drop изображения
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleExcerptResizeStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const startH = excerptHeight;
      const onMove = (ev: PointerEvent) => {
        const newH = Math.max(96, Math.min(480, startH + ev.clientY - startY));
        setExcerptHeight(newH);
      };
      const onUp = () => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    },
    [excerptHeight]
  );

  const handleDividerPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingDivider(true);
    const onMove = (ev: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setLeftPct(Math.max(MIN_LEFT_PCT, Math.min(MAX_LEFT_PCT, pct)));
    };
    const onUp = () => {
      setIsDraggingDivider(false);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, []);

  const handleBeautifyExcerpt = async () => {
    try {
      const formatted = await prettier.format(excerpt, {
        parser: 'html',
        plugins: [htmlPlugin],
        printWidth: 80,
        tabWidth: 2,
        htmlWhitespaceSensitivity: 'ignore',
      });
      setValue('excerpt', formatted.trim());
    } catch {
      excerptEditorRef.current
        ?.getAction('editor.action.formatDocument')
        ?.run();
    }
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setValue('imageUrl', url);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const filteredSuggestions = tagInput.trim()
    ? KNOWN_TAGS.filter(
        t =>
          t.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(t)
      )
    : [];

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setValue('tags', [...tags, trimmed]);
    }
    setTagInput('');
    setTagPopoverOpen(false);
    setHighlightedIndex(-1);
    tagInputRef.current?.focus();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (tagPopoverOpen && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(i =>
          i < filteredSuggestions.length - 1 ? i + 1 : 0
        );
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(i =>
          i > 0 ? i - 1 : filteredSuggestions.length - 1
        );
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
          addTag(filteredSuggestions[highlightedIndex]);
        } else {
          addTag(tagInput);
        }
        return;
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === 'Escape') {
      setTagPopoverOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter(t => t !== tagToRemove)
    );
  };

  return (
    <div
      ref={containerRef}
      className='flex h-full gap-0 px-4 pb-4 pt-4'
      style={{ userSelect: isDraggingDivider ? 'none' : undefined }}
    >
      {/* Левая колонка — поля формы */}
      <div
        className='h-full min-w-0 overflow-hidden border rounded-lg'
        style={{ width: `${leftPct}%`, flexShrink: 0 }}
      >
        <ScrollArea className='h-full [&_[data-slot=scroll-area-viewport]]:!block [&_[data-slot=scroll-area-viewport]>div]:!block'>
          <div className='p-8 space-y-6'>
            <FormFieldInput
              label='Заголовок H1'
              htmlFor='h1'
              hintKnowledgeBaseUrl='/admin/seo/h1'
              hint={
                <>
                  <h4>Назначение</h4>
                  <p>
                    Основной заголовок, отображаемый на странице статьи. Именно
                    его видит читатель при открытии материала.
                  </p>

                  <h4>Рекомендации</h4>
                  <ul>
                    <li>
                      <strong>Длина:</strong> 40–70 символов
                    </li>
                    <li>Должен точно отражать содержание статьи</li>
                    <li>
                      Допускается эмоциональная окраска и интригующие
                      формулировки
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
              label='Подзаголовок'
              htmlFor='subtitle'
              hint={
                <>
                  <h4>Назначение</h4>
                  <p>
                    Дополнительная строка под заголовком, раскрывающая тему
                    статьи. Помогает читателю быстро понять, о чём пойдёт речь.
                  </p>
                  <h4>Рекомендации</h4>
                  <ul>
                    <li>Краткое уточнение или интригующий тезис</li>
                    <li>Не дублировать H1 — дополнять его</li>
                    <li>Оптимальная длина: 50–120 символов</li>
                  </ul>
                </>
              }
            >
              <Input
                id='subtitle'
                placeholder='Уточнение или раскрытие темы...'
                {...register('subtitle')}
              />
            </FormFieldInput>

            <FormFieldInput label='Миниатюра' htmlFor='imageUrl'>
              <div
                className={`relative rounded-lg border-2 border-dashed transition-colors ${
                  isDraggingImage
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/20 hover:border-muted-foreground/40'
                }`}
                onDragOver={e => {
                  e.preventDefault();
                  setIsDraggingImage(true);
                }}
                onDragLeave={() => setIsDraggingImage(false)}
                onDrop={handleImageDrop}
              >
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageInputChange}
                />
                {imageUrl ? (
                  <div className='relative group'>
                    <img
                      src={imageUrl}
                      alt='Миниатюра'
                      className='w-full h-32 object-cover rounded-md'
                    />
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center gap-2'>
                      <Button
                        type='button'
                        variant='secondary'
                        size='sm'
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Заменить
                      </Button>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() => setValue('imageUrl', '')}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type='button'
                    className='w-full py-6 flex flex-col items-center gap-2 cursor-pointer'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className='rounded-full bg-muted p-2.5'>
                      <ImageIcon className='size-5 text-muted-foreground' />
                    </div>
                    <div className='text-center'>
                      <p className='text-sm text-muted-foreground'>
                        Перетащите изображение или{' '}
                        <span className='text-primary underline underline-offset-2'>
                          выберите файл
                        </span>
                      </p>
                      <p className='text-xs text-muted-foreground/60 mt-0.5'>
                        JPG, PNG, WebP
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </FormFieldInput>

            <FormFieldInput
              label='Краткое описание (Excerpt)'
              htmlFor='excerpt'
            >
              <div className='group/excerpt relative'>
                <div className='absolute -top-7 right-0 flex items-center gap-0.5 opacity-0 group-hover/excerpt:opacity-100 group-focus-within/excerpt:opacity-100 transition-opacity'>
                  {excerptMode === 'html' && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='size-6 text-muted-foreground/40 hover:text-muted-foreground'
                      onClick={handleBeautifyExcerpt}
                      title='Форматировать HTML (Prettier)'
                      type='button'
                    >
                      <WandSparkles className='size-3' />
                    </Button>
                  )}
                  <Button
                    ref={excerptSettings.triggerRef}
                    variant='ghost'
                    size='icon'
                    className='size-6 text-muted-foreground/40 hover:text-muted-foreground'
                    title='Настройки редактора'
                    type='button'
                    onClick={excerptSettings.toggle}
                  >
                    <Settings2 className='size-3' />
                  </Button>
                </div>
                <div>
                  <div
                    className='overflow-hidden'
                    style={{ height: excerptHeight }}
                  >
                    {excerptMode === 'html' ? (
                      <div className='rounded-md overflow-hidden border h-full relative'>
                        <div className='absolute inset-0'>
                          <Editor
                            height='100%'
                            language='html'
                            value={excerpt}
                            onChange={value => setValue('excerpt', value || '')}
                            onMount={editor => {
                              excerptEditorRef.current = editor;
                            }}
                            beforeMount={defineCustomThemes}
                            theme={excerptTheme}
                            options={{
                              minimap: { enabled: excerptMinimap },
                              fontSize: excerptFontSize,
                              lineNumbers: excerptLineNumbers ? 'on' : 'off',
                              wordWrap: excerptWordWrap ? 'on' : 'off',
                              automaticLayout: true,
                              scrollBeyondLastLine: false,
                              padding: { top: 8 },
                              renderLineHighlight: 'none',
                              overviewRulerLanes: 0,
                              scrollbar: { vertical: 'hidden' },
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <MiniWysiwygEditor
                        value={excerpt}
                        onChange={html => setValue('excerpt', html)}
                      />
                    )}
                  </div>
                  <div
                    className='flex items-center justify-center h-3 cursor-row-resize select-none text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors'
                    onPointerDown={handleExcerptResizeStart}
                  >
                    <GripHorizontal className='size-4' />
                  </div>
                </div>
              </div>
            </FormFieldInput>

            <FormFieldInput label='Категория'>
              <Select
                value={category}
                onValueChange={v => setValue('category', v)}
              >
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
              <div className='relative'>
                <Input
                  ref={tagInputRef}
                  placeholder='Введите метку и нажмите Enter...'
                  value={tagInput}
                  onChange={e => {
                    setTagInput(e.target.value);
                    setTagPopoverOpen(e.target.value.trim().length > 0);
                    setHighlightedIndex(-1);
                  }}
                  onKeyDown={handleTagKeyDown}
                  onFocus={() => {
                    if (tagInput.trim()) setTagPopoverOpen(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setTagPopoverOpen(false), 150);
                  }}
                />
                {tagPopoverOpen && filteredSuggestions.length > 0 && (
                  <div className='absolute z-50 top-full left-0 right-0 mt-1 rounded-md border bg-popover p-1 shadow-md'>
                    <div className='max-h-48 overflow-y-auto'>
                      {filteredSuggestions.map((suggestion, idx) => (
                        <button
                          key={suggestion}
                          type='button'
                          className={`w-full text-left px-2.5 py-1.5 text-sm rounded-sm transition-colors cursor-pointer ${idx === highlightedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                          onMouseDown={e => {
                            e.preventDefault();
                            addTag(suggestion);
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {tags.length > 0 && (
                <div className='flex flex-wrap gap-1.5 mt-2'>
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
              )}
            </FormFieldInput>
          </div>
        </ScrollArea>
      </div>

      {/* Перетаскиваемый разделитель */}
      <div
        className='flex items-center justify-center w-2 cursor-col-resize select-none shrink-0 mx-1'
        onPointerDown={handleDividerPointerDown}
      >
        <GripVertical className='size-4 text-muted-foreground/30' />
      </div>

      {/* Правая колонка — живое превью карточки */}
      <div className='flex-1 min-w-0 border rounded-lg'>
        <LiveCardPreview
          title={h1}
          subtitle={subtitle}
          category={category}
          excerpt={excerpt}
          imageUrl={imageUrl}
          slug={slug}
        />
      </div>

      {/* Плавающая панель настроек редактора */}
      <EditorSettingsPanel
        {...excerptSettings}
        fontSize={excerptFontSize}
        onFontSizeChange={setExcerptFontSize}
        fontSizeMin={10}
        fontSizeMax={20}
        wordWrap={excerptWordWrap}
        onWordWrapChange={setExcerptWordWrap}
        lineNumbers={excerptLineNumbers}
        onLineNumbersChange={setExcerptLineNumbers}
        minimap={excerptMinimap}
        onMinimapChange={setExcerptMinimap}
        theme={excerptTheme}
        onThemeChange={setExcerptTheme}
      >
        {/* Режим редактора */}
        <div className='border-t border-border/50 pt-4'>
          <div className='flex items-center justify-between'>
            <Label className='text-xs'>Режим</Label>
            <Select
              value={excerptMode}
              onValueChange={v => setExcerptMode(v as ExcerptMode)}
            >
              <SelectTrigger className='w-[120px]' size='sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='html'>HTML</SelectItem>
                <SelectItem value='wysiwyg'>WYSIWYG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </EditorSettingsPanel>
    </div>
  );
}
