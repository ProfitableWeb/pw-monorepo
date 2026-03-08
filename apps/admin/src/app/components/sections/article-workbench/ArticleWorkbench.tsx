/**
 * Главный оркестратор редактора статей.
 *
 * Архитектура:
 * - Форма управляется через `react-hook-form` (register/watch/setValue)
 *   и прокидывается во вкладки — каждая вкладка работает с нужным срезом данных.
 * - Глобальное состояние (editorMode, content, autosave) — в Zustand-сторе
 *   `article-editor-store`, локальное состояние формы — в `useForm`.
 * - Шесть вкладок: Карточка, SEO, Редактор, Артефакты, Исследование, История.
 *
 * @see tabs/ — реализация каждой вкладки
 * @see article-editor-store — Zustand-стор глобального состояния редактора
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { Calendar } from '@/app/components/ui/calendar';
import { Input } from '@/app/components/ui/input';
import { Save, Loader2, CalendarClock } from 'lucide-react';
import { CardTab } from './tabs/card';
import { SeoTab } from './tabs/seo';
import { EditorTab } from './tabs/editor';
import { ArtifactsTab } from './tabs/artifacts';
import { ResearchTab } from './tabs/research';
import { HistoryTab } from './tabs/history';
import { useArticleEditorStore } from '@/app/store/article-editor-store';
import { useHeaderStore } from '@/app/store/header-store';
import { useNavigationStore } from '@/app/store/navigation-store';
import { mockArticle } from '@/app/mock/article-mock';
import type {
  ArticleFormData,
  ArticleStatus,
} from '@/app/types/article-editor';

/** Цвет точки и label для каждого статуса публикации */
const STATUS_CONFIG: Record<
  ArticleStatus,
  { label: string; dotClass: string }
> = {
  draft: { label: 'Черновик', dotClass: 'bg-amber-500' },
  published: { label: 'Опубликована', dotClass: 'bg-emerald-500' },
  scheduled: { label: 'Запланирована', dotClass: 'bg-blue-500' },
  archived: { label: 'В архиве', dotClass: 'bg-zinc-400' },
};

const MONTHS_SHORT = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
];

/** Часовые пояса для селектора */
const TZ_DEFAULT = { value: '+03:00', label: 'МСК (UTC+3)', abbr: 'МСК' };
const TIMEZONE_OPTIONS: { value: string; label: string; abbr: string }[] = [
  { value: '+02:00', label: 'КЛД (UTC+2)', abbr: 'КЛД' },
  { value: '+03:00', label: 'МСК (UTC+3)', abbr: 'МСК' },
  { value: '+05:00', label: 'ЕКБ (UTC+5)', abbr: 'ЕКБ' },
  { value: '+07:00', label: 'НСК (UTC+7)', abbr: 'НСК' },
  { value: '+10:00', label: 'ВЛД (UTC+10)', abbr: 'ВЛД' },
  { value: '+00:00', label: 'UTC', abbr: 'UTC' },
];

/** Смещение UTC-строки в минуты: '+03:00' → 180 */
function parseOffsetMinutes(offset: string): number {
  const m = offset.match(/^([+-])(\d{2}):(\d{2})$/);
  if (!m) return 180;
  return (m[1] === '+' ? 1 : -1) * (Number(m[2]) * 60 + Number(m[3]));
}

/** Часы и минуты из UTC ISO-строки в заданном смещении */
function getTimeInOffset(
  utcIso: string,
  offset: string
): { hours: number; minutes: number } {
  const d = new Date(utcIso);
  if (isNaN(d.getTime())) return { hours: 12, minutes: 0 };
  const total =
    d.getUTCHours() * 60 + d.getUTCMinutes() + parseOffsetMinutes(offset);
  const norm = ((total % 1440) + 1440) % 1440;
  return { hours: Math.floor(norm / 60), minutes: norm % 60 };
}

/** Форматирование ISO-строки в компактный вид с учётом часового пояса */
function formatPublishDate(iso: string, offset: string, abbr: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const offsetMs = parseOffsetMinutes(offset) * 60000;
  const shifted = new Date(d.getTime() + offsetMs);
  const hh = String(shifted.getUTCHours()).padStart(2, '0');
  const mm = String(shifted.getUTCMinutes()).padStart(2, '0');
  return `${shifted.getUTCDate()} ${MONTHS_SHORT[shifted.getUTCMonth()]} ${shifted.getUTCFullYear()}, ${hh}:${mm} ${abbr}`;
}

export function ArticleWorkbench() {
  const { articleSlug, openArticle, closeArticle, setContent } =
    useArticleEditorStore();

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    // TODO: реальный вызов API
    await new Promise(r => setTimeout(r, 600));
    setIsSaving(false);
  }, []);
  const { setBreadcrumbs } = useHeaderStore();
  const { navigateTo } = useNavigationStore();

  const { register, watch, setValue } = useForm<ArticleFormData>({
    defaultValues: mockArticle,
  });

  const currentStatus = watch('status');
  const publishedAt = watch('publishedAt');
  const publishTimezone = watch('publishTimezone');

  const tzOption = useMemo(
    () => TIMEZONE_OPTIONS.find(o => o.value === publishTimezone) ?? TZ_DEFAULT,
    [publishTimezone]
  );

  const selectedDate = useMemo(() => {
    if (!publishedAt) return undefined;
    const d = new Date(publishedAt);
    if (isNaN(d.getTime())) return undefined;
    const offsetMs = parseOffsetMinutes(publishTimezone) * 60000;
    const shifted = new Date(d.getTime() + offsetMs);
    return new Date(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth(),
      shifted.getUTCDate()
    );
  }, [publishedAt, publishTimezone]);

  const handleDateSelect = useCallback(
    (day: Date | undefined) => {
      if (!day) return;
      const prevTime = getTimeInOffset(
        publishedAt || new Date().toISOString(),
        publishTimezone
      );
      const offsetMin = parseOffsetMinutes(publishTimezone);
      const utcTotalMin = prevTime.hours * 60 + prevTime.minutes - offsetMin;
      const norm = ((utcTotalMin % 1440) + 1440) % 1440;
      const utcDate = new Date(
        Date.UTC(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          Math.floor(norm / 60),
          norm % 60,
          0,
          0
        )
      );
      setValue('publishedAt', utcDate.toISOString());
    },
    [publishedAt, publishTimezone, setValue]
  );

  const handleTimeChange = useCallback(
    (hours: number, minutes: number) => {
      const base = publishedAt ? new Date(publishedAt) : new Date();
      const offsetMin = parseOffsetMinutes(publishTimezone);
      const shiftedDate = new Date(base.getTime() + offsetMin * 60000);
      const utcTotalMin = hours * 60 + minutes - offsetMin;
      const norm = ((utcTotalMin % 1440) + 1440) % 1440;
      const utcDate = new Date(
        Date.UTC(
          shiftedDate.getUTCFullYear(),
          shiftedDate.getUTCMonth(),
          shiftedDate.getUTCDate(),
          Math.floor(norm / 60),
          norm % 60,
          0,
          0
        )
      );
      setValue('publishedAt', utcDate.toISOString());
    },
    [publishedAt, publishTimezone, setValue]
  );

  const timeValue = useMemo(
    () =>
      getTimeInOffset(publishedAt || new Date().toISOString(), publishTimezone),
    [publishedAt, publishTimezone]
  );

  // Синхронизация изменений формы → Zustand-стор (для EditorTab и HistoryTab)
  useEffect(() => {
    const subscription = watch(data => {
      if (data.content) setContent(data.content);
    });
    return () => subscription.unsubscribe();
  }, [watch, setContent]);

  // Загрузка мок-статьи при монтировании (позже — загрузка по slug из API)
  useEffect(() => {
    if (!articleSlug) {
      openArticle(mockArticle.slug, mockArticle.content);
    }
  }, [articleSlug, openArticle]);

  // Хлебные крошки: «Статьи > {название}»
  useEffect(() => {
    setBreadcrumbs([
      {
        label: 'Статьи',
        onClick: () => {
          closeArticle();
          navigateTo('articles');
        },
      },
      { label: mockArticle.h1 },
    ]);

    return () => {
      useHeaderStore.getState().reset();
    };
  }, [setBreadcrumbs, navigateTo, closeArticle]);

  return (
    <Tabs
      defaultValue='card'
      variant='line'
      className='flex-1 flex flex-col min-h-0 h-full gap-0'
    >
      <div className='flex items-center justify-between px-4 mt-2 border-b border-border'>
        <TabsList className='border-b-0 translate-y-[1px]'>
          <TabsTrigger value='card'>Карточка</TabsTrigger>
          <TabsTrigger value='seo'>SEO</TabsTrigger>
          <TabsTrigger value='editor'>Редактор</TabsTrigger>
          <TabsTrigger value='artifacts'>Артефакты</TabsTrigger>
          <TabsTrigger value='research'>Исследование</TabsTrigger>
          <TabsTrigger value='history'>История</TabsTrigger>
        </TabsList>

        <div className='flex items-center gap-3 mb-2'>
          {(currentStatus === 'scheduled' || currentStatus === 'published') && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-7 gap-1.5 text-xs font-normal'
                >
                  <CalendarClock className='h-3.5 w-3.5' />
                  {publishedAt
                    ? formatPublishDate(
                        publishedAt,
                        publishTimezone,
                        tzOption.abbr
                      )
                    : 'Выберите дату'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='end'>
                <Calendar
                  mode='single'
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  {...(currentStatus === 'scheduled'
                    ? { disabled: { before: new Date() } }
                    : {})}
                />
                <div className='border-t border-border px-3 py-2 flex flex-col gap-2'>
                  <div className='flex items-center gap-2'>
                    <label className='text-xs text-muted-foreground whitespace-nowrap'>
                      Время:
                    </label>
                    <div className='flex items-center gap-0.5'>
                      <Input
                        type='number'
                        min={0}
                        max={23}
                        value={timeValue.hours}
                        onChange={e =>
                          handleTimeChange(
                            Math.min(
                              23,
                              Math.max(0, Number(e.target.value) || 0)
                            ),
                            timeValue.minutes
                          )
                        }
                        className='h-7 w-12 text-xs text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                      />
                      <span className='text-xs text-muted-foreground font-medium'>
                        :
                      </span>
                      <Input
                        type='number'
                        min={0}
                        max={59}
                        value={timeValue.minutes}
                        onChange={e =>
                          handleTimeChange(
                            timeValue.hours,
                            Math.min(
                              59,
                              Math.max(0, Number(e.target.value) || 0)
                            )
                          )
                        }
                        className='h-7 w-12 text-xs text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                      />
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <label className='text-xs text-muted-foreground whitespace-nowrap'>
                      Пояс:
                    </label>
                    <Select
                      value={publishTimezone}
                      onValueChange={v => setValue('publishTimezone', v)}
                    >
                      <SelectTrigger size='sm' className='h-7 text-xs flex-1'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONE_OPTIONS.map(tz => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Select
            value={currentStatus}
            onValueChange={v => setValue('status', v as ArticleStatus)}
          >
            <SelectTrigger size='sm' className='w-[150px] h-7 text-xs'>
              <SelectValue>
                <span className='flex items-center gap-2'>
                  <span
                    className={`size-2 rounded-full ${STATUS_CONFIG[currentStatus].dotClass}`}
                  />
                  {STATUS_CONFIG[currentStatus].label}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(STATUS_CONFIG) as ArticleStatus[]).map(key => (
                <SelectItem key={key} value={key}>
                  <span className='flex items-center gap-2'>
                    <span
                      className={`size-2 rounded-full ${STATUS_CONFIG[key].dotClass}`}
                    />
                    {STATUS_CONFIG[key].label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? (
              <Loader2 className='h-3.5 w-3.5 animate-spin' />
            ) : (
              <Save className='h-3.5 w-3.5' />
            )}
            Сохранить
          </Button>
        </div>
      </div>

      <TabsContent value='card' className='flex-1 overflow-auto mt-0'>
        <CardTab register={register} watch={watch} setValue={setValue} />
      </TabsContent>

      <TabsContent
        value='seo'
        className='flex-1 flex flex-col min-h-0 overflow-hidden mt-0'
      >
        <SeoTab register={register} watch={watch} setValue={setValue} />
      </TabsContent>

      <TabsContent value='editor' className='flex-1 min-h-0 mt-0'>
        <EditorTab formData={watch()} />
      </TabsContent>

      <TabsContent value='artifacts' className='flex-1 overflow-auto mt-0'>
        <ArtifactsTab watch={watch} setValue={setValue} />
      </TabsContent>

      <TabsContent value='research' className='flex-1 overflow-auto mt-0'>
        <ResearchTab />
      </TabsContent>

      <TabsContent value='history' className='flex-1 min-h-0 mt-0'>
        <HistoryTab
          currentContent={watch('content')}
          onRestore={content => setValue('content', content)}
        />
      </TabsContent>
    </Tabs>
  );
}
