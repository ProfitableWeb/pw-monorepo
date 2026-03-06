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
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/button';
import { Save, CheckCircle2, Loader2, WifiOff } from 'lucide-react';
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
import type { ArticleFormData } from '@/app/types/article-editor';
import type { AutosaveStatus } from '@/app/types/article-editor';

const AUTOSAVE_CONFIG: Record<
  AutosaveStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  saved: {
    label: 'Сохранено',
    icon: CheckCircle2,
    className: 'text-muted-foreground',
  },
  syncing: {
    label: 'Сохранение...',
    icon: Loader2,
    className: 'text-muted-foreground',
  },
  offline: { label: 'Офлайн', icon: WifiOff, className: 'text-destructive' },
};

export function ArticleWorkbench() {
  const {
    articleSlug,
    openArticle,
    closeArticle,
    setContent,
    autosaveStatus,
    markSaved,
  } = useArticleEditorStore();

  const statusConfig = AUTOSAVE_CONFIG[autosaveStatus];
  const StatusIcon = statusConfig.icon;

  const handleSave = useCallback(() => {
    markSaved();
  }, [markSaved]);
  const { setBreadcrumbs } = useHeaderStore();
  const { navigateTo } = useNavigationStore();

  const { register, watch, setValue } = useForm<ArticleFormData>({
    defaultValues: mockArticle,
  });

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
          <span
            className={`flex items-center gap-1.5 text-xs ${statusConfig.className}`}
          >
            <StatusIcon
              className={`h-3.5 w-3.5 ${autosaveStatus === 'syncing' ? 'animate-spin' : ''}`}
            />
            {statusConfig.label}
          </span>
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            onClick={handleSave}
          >
            <Save className='h-3.5 w-3.5' />
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
