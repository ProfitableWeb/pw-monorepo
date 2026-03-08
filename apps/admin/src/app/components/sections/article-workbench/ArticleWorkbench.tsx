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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { Save, Loader2, CalendarClock, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { CardTab } from './tabs/card';
import { SeoTab } from './tabs/seo';
import { EditorTab } from './tabs/editor';
import { ArtifactsTab } from './tabs/artifacts';
import { ResearchTab } from './tabs/research';
import { HistoryTab } from './tabs/history';
import { useArticleEditorStore } from '@/app/store/article-editor-store';
import { toast } from 'sonner';
import { useHeaderStore } from '@/app/store/header-store';
import { useNavigationStore } from '@/app/store/navigation-store';
import {
  useAdminArticle,
  useUpdateArticle,
  useCreateArticle,
  usePublishArticle,
  useScheduleArticle,
  useUnpublishArticle,
  useDeleteArticle,
  useAdminCategories,
} from '@/hooks/api';
import { useSystemSettings } from '@/hooks/api/useSystemSettings';
import {
  apiToFormData,
  formDataToUpdatePayload,
  formDataToCreatePayload,
  getEmptyFormData,
} from '@/lib/mappers';
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
  published: { label: 'Опубликована', dotClass: 'bg-[#5ADC5A]' },
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

/** Debounce интервал автосохранения (мс) */
const AUTOSAVE_DELAY = 4000;

export function ArticleWorkbench() {
  const {
    articleId,
    openArticle,
    closeArticle,
    setContent,
    markSaved,
    setAutosaveStatus,
  } = useArticleEditorStore();

  const { editArticleId } = useNavigationStore();
  const isCreateMode = !editArticleId;

  // --- API данные ---
  const { data: apiArticle, isLoading: isLoadingArticle } = useAdminArticle(
    editArticleId ?? null
  );
  const { data: settings } = useSystemSettings();
  const { data: categories } = useAdminCategories();
  const timezone = settings?.timezone ?? '+03:00';

  // --- Мутации ---
  const updateMutation = useUpdateArticle();
  const createMutation = useCreateArticle();
  const publishMutation = usePublishArticle();
  const scheduleMutation = useScheduleArticle();
  const unpublishMutation = useUnpublishArticle();
  const deleteMutation = useDeleteArticle();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const isSaving = updateMutation.isPending || createMutation.isPending;

  const { setBreadcrumbs } = useHeaderStore();
  const { navigateTo, navigateToArticleEditor } = useNavigationStore();

  // --- Форма ---
  const defaultValues = useMemo(() => {
    if (apiArticle) return apiToFormData(apiArticle, timezone);
    return getEmptyFormData(timezone);
  }, [apiArticle, timezone]);

  const { register, watch, setValue, reset, getValues } =
    useForm<ArticleFormData>({
      defaultValues,
    });

  // Сброс формы при загрузке данных из API
  useEffect(() => {
    if (apiArticle) {
      const formData = apiToFormData(apiArticle, timezone);
      reset(formData);
      openArticle(apiArticle.id, apiArticle.slug, apiArticle.content);
    } else if (isCreateMode) {
      const empty = getEmptyFormData(timezone);
      reset(empty);
      openArticle(null, '', '');
    }
  }, [apiArticle, timezone, isCreateMode, reset, openArticle]);

  const currentStatus = watch('status');
  const publishedAt = watch('publishedAt');
  const publishTimezone = watch('publishTimezone');
  const h1 = watch('h1');

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

  // --- Сохранение ---
  const handleSave = useCallback(async () => {
    if (!categories) return;
    const formData = getValues();

    try {
      if (isCreateMode || !articleId) {
        createMutation.mutate(formDataToCreatePayload(formData, categories), {
          onSuccess: result => {
            openArticle(result.id, result.slug, result.content);
            markSaved();
            navigateToArticleEditor(result.id);
          },
          onError: () => toast.error('Не удалось создать статью'),
        });
      } else {
        updateMutation.mutate(
          { articleId, data: formDataToUpdatePayload(formData, categories) },
          {
            onSuccess: () => markSaved(),
            onError: () => toast.error('Не удалось сохранить статью'),
          }
        );
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка сохранения');
    }
  }, [
    getValues,
    categories,
    isCreateMode,
    articleId,
    createMutation,
    updateMutation,
    openArticle,
    markSaved,
    navigateToArticleEditor,
  ]);

  // --- Автосохранение (debounced) ---
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    const subscription = watch((data, { type }) => {
      if (data.content != null) setContent(data.content);

      // Автосохранение только для существующих статей
      if (type !== 'change' || !articleId) return;

      setAutosaveStatus('syncing');
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = setTimeout(() => {
        if (!categories) return;
        try {
          const formData = getValues();
          updateMutation.mutate(
            { articleId, data: formDataToUpdatePayload(formData, categories) },
            {
              onSuccess: () => markSaved(),
              onError: () => setAutosaveStatus('offline'),
            }
          );
        } catch {
          setAutosaveStatus('offline');
        }
      }, AUTOSAVE_DELAY);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(autosaveTimerRef.current);
    };
  }, [
    watch,
    setContent,
    articleId,
    getValues,
    categories,
    updateMutation,
    markSaved,
    setAutosaveStatus,
  ]);

  // --- Смена статуса через select ---
  const handleStatusChange = useCallback(
    (newStatus: string) => {
      if (!articleId) {
        setValue('status', newStatus as ArticleStatus);
        return;
      }

      const prevStatus = currentStatus;
      if (newStatus === prevStatus) return;

      if (newStatus === 'published') {
        publishMutation.mutate(articleId, {
          onSuccess: res => {
            setValue('status', res.status as ArticleStatus);
            if (res.publishedAt) setValue('publishedAt', res.publishedAt);
          },
          onError: () => toast.error('Не удалось опубликовать статью'),
        });
      } else if (newStatus === 'scheduled') {
        const publishedAt = getValues('publishedAt');
        if (!publishedAt) {
          toast.error('Укажите дату публикации для планирования');
          return;
        }
        scheduleMutation.mutate(
          { articleId, publishedAt },
          {
            onSuccess: res => {
              setValue('status', res.status as ArticleStatus);
              if (res.publishedAt) setValue('publishedAt', res.publishedAt);
            },
            onError: () => toast.error('Не удалось запланировать публикацию'),
          }
        );
      } else if (newStatus === 'archived') {
        deleteMutation.mutate(
          { articleId },
          {
            onSuccess: () => setValue('status', 'archived' as ArticleStatus),
            onError: () => toast.error('Не удалось архивировать статью'),
          }
        );
      } else if (newStatus === 'draft') {
        unpublishMutation.mutate(articleId, {
          onSuccess: res => setValue('status', res.status as ArticleStatus),
          onError: () => toast.error('Не удалось снять с публикации'),
        });
      }
    },
    [
      articleId,
      currentStatus,
      publishMutation,
      scheduleMutation,
      unpublishMutation,
      deleteMutation,
      setValue,
      getValues,
    ]
  );

  // --- Удаление ---
  const handleDelete = useCallback(() => {
    if (!articleId) return;
    deleteMutation.mutate(
      { articleId },
      {
        onSuccess: () => {
          closeArticle();
          navigateTo('articles');
        },
        onError: () => toast.error('Не удалось удалить статью'),
      }
    );
    setDeleteConfirmOpen(false);
  }, [articleId, deleteMutation, closeArticle, navigateTo]);

  // --- Хлебные крошки ---
  useEffect(() => {
    setBreadcrumbs([
      {
        label: 'Статьи',
        onClick: () => {
          closeArticle();
          navigateTo('articles');
        },
      },
      { label: h1 || (isCreateMode ? 'Новая статья' : 'Загрузка...') },
    ]);

    return () => {
      useHeaderStore.getState().reset();
    };
  }, [setBreadcrumbs, navigateTo, closeArticle, h1, isCreateMode]);

  // --- Loading state ---
  if (!isCreateMode && isLoadingArticle) {
    return (
      <div className='flex items-center justify-center h-full text-muted-foreground'>
        <Loader2 className='h-5 w-5 animate-spin mr-2' />
        Загрузка статьи...
      </div>
    );
  }

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
          <TabsTrigger value='history' disabled={isCreateMode}>
            История
          </TabsTrigger>
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

          <Select value={currentStatus} onValueChange={handleStatusChange}>
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
            disabled={isSaving || !categories}
            onClick={handleSave}
          >
            {isSaving ? (
              <Loader2 className='h-3.5 w-3.5 animate-spin' />
            ) : (
              <Save className='h-3.5 w-3.5' />
            )}
            Сохранить
          </Button>

          {!isCreateMode && (
            <Button
              variant='ghost'
              size='icon'
              className='size-7 text-muted-foreground hover:text-destructive'
              title='Удалить статью'
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className='size-3.5' />
            </Button>
          )}
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
          articleId={articleId}
          currentContent={watch('content')}
          onRestore={content => setValue('content', content)}
        />
      </TabsContent>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить статью?</AlertDialogTitle>
            <AlertDialogDescription>
              Статья «{h1}» будет перемещена в архив.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={handleDelete}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  );
}
