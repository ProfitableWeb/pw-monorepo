/**
 * PW-046/PW-047 | Оркестратор SEO-раздела.
 * Управляет sidebar-навигацией, маршрутизацией контента по категориям
 * и отображением базы знаний.
 * PW-047: загрузка SEO-настроек из API, сохранение через PATCH.
 */
import { useHeaderStore } from '@/app/store/header-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard,
  SearchCheck,
  Search,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import { SYSTEM_BREADCRUMB } from '@/app/store/breadcrumb.constants';
import { KnowledgeBase } from './knowledge-base';
import { useNavigationStore } from '@/app/store/navigation-store';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';
import { LoadingSpinner } from '@/app/components/common';
import {
  getSeoSettings,
  getYandexStatus,
  updateSeoSettings,
  type SeoSettings,
  type YandexConnectionStatus,
} from '@/lib/api-client';

import { seoCategories } from './seo.constants';
import { GeneralSeoSettings } from './assets/GeneralSeoSettings';
import { MetaTagsSettings } from './assets/MetaTagsSettings';
import { IndexingFeedsSettings } from './assets/IndexingFeedsSettings';
import { SchemaSettings } from './assets/SchemaSettings';
import { YandexMetrikaSettings } from './assets/YandexMetrikaSettings';
import { YandexWebmasterSettings } from './assets/YandexWebmasterSettings';
import { PerformanceSettings } from './assets/PerformanceSettings';
import { UrlSettings } from './assets/UrlSettings';
import { ContentAnalysisSettings } from './assets/ContentAnalysisSettings';

export function SeoPage() {
  const { setBreadcrumbs, reset } = useHeaderStore();
  const { seoKbArticleId, clearSeoKbArticleId } = useNavigationStore();
  const [activeCategory, setActiveCategory] = useState(
    seoKbArticleId ? 'knowledge-base' : 'general'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [seoSettings, setSeoSettings] = useState<SeoSettings | null>(null);
  const [isSeoLoading, setIsSeoLoading] = useState(true);
  const [yandexConnection, setYandexConnection] =
    useState<YandexConnectionStatus | null>(null);
  const pendingChanges = useRef<Partial<SeoSettings>>({});
  const isKnowledgeBase = activeCategory === 'knowledge-base';

  // Загрузка SEO-настроек + статус Yandex OAuth (параллельно)
  useEffect(() => {
    Promise.all([
      getSeoSettings().catch(err => {
        console.error('Ошибка загрузки SEO-настроек:', err);
        return null;
      }),
      getYandexStatus().catch(
        () =>
          ({
            connected: false,
            account: null,
            permissions: null,
            connectedAt: null,
          }) as YandexConnectionStatus
      ),
    ]).then(([settings, connection]) => {
      if (settings) setSeoSettings(settings);
      setYandexConnection(connection);
      setIsSeoLoading(false);
    });
  }, []);

  /** Принимает обновления от дочерних компонентов, накапливает до сохранения */
  const handleSeoDataChange = useCallback((update: Partial<SeoSettings>) => {
    pendingChanges.current = { ...pendingChanges.current, ...update };
    setSeoSettings(prev => (prev ? { ...prev, ...update } : null));
    setHasUnsavedChanges(true);
  }, []);

  // Реакция на навигацию из InfoHint
  useEffect(() => {
    if (seoKbArticleId) {
      setActiveCategory('knowledge-base');
    }
  }, [seoKbArticleId]);

  // Очистка articleId при уходе из категории KB
  useEffect(() => {
    if (activeCategory !== 'knowledge-base' && seoKbArticleId) {
      clearSeoKbArticleId();
    }
  }, [activeCategory, seoKbArticleId, clearSeoKbArticleId]);

  // Обновляем breadcrumbs при изменении активной категории
  useEffect(() => {
    const currentCategory = seoCategories.find(
      cat => cat.id === activeCategory
    );

    setBreadcrumbs([
      { label: 'Дашборд', href: 'dashboard', icon: LayoutDashboard },
      SYSTEM_BREADCRUMB,
      {
        label: 'SEO',
        icon: SearchCheck,
        ...(isKnowledgeBase
          ? {
              dropdown: seoCategories.map(cat => ({
                label: cat.label,
                icon: cat.icon,
                onClick: () => setActiveCategory(cat.id),
              })),
            }
          : {}),
      },
      ...(currentCategory
        ? [{ label: currentCategory.label, icon: currentCategory.icon }]
        : []),
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset, activeCategory]);

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'general':
        return (
          <GeneralSeoSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'meta':
        return (
          <MetaTagsSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'indexing':
        if (isSeoLoading) {
          return <LoadingSpinner className='py-12' />;
        }
        return (
          <IndexingFeedsSettings
            initialData={seoSettings}
            onDataChange={handleSeoDataChange}
          />
        );
      case 'schema':
        return (
          <SchemaSettings onChangeDetected={() => setHasUnsavedChanges(true)} />
        );
      case 'metrika':
        if (isSeoLoading) {
          return <LoadingSpinner className='py-12' />;
        }
        return (
          <YandexMetrikaSettings
            initialData={seoSettings}
            onDataChange={handleSeoDataChange}
            connection={yandexConnection}
            onConnectionChange={setYandexConnection}
          />
        );
      case 'webmaster':
        if (isSeoLoading) {
          return <LoadingSpinner className='py-12' />;
        }
        return (
          <YandexWebmasterSettings
            connection={yandexConnection}
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'performance':
        return (
          <PerformanceSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'urls':
        return (
          <UrlSettings onChangeDetected={() => setHasUnsavedChanges(true)} />
        );
      case 'content':
        return (
          <ContentAnalysisSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'knowledge-base':
        return <KnowledgeBase initialArticleId={seoKbArticleId} />;
      default:
        return null;
    }
  };

  const handleSave = async () => {
    const changes = pendingChanges.current;
    if (Object.keys(changes).length === 0) {
      setHasUnsavedChanges(false);
      return;
    }
    setIsSaving(true);
    try {
      const updated = await updateSeoSettings(changes);
      setSeoSettings(updated);
      pendingChanges.current = {};
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Ошибка сохранения SEO-настроек:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Перезагружаем настройки из API, сбрасывая все изменения
    pendingChanges.current = {};
    setHasUnsavedChanges(false);
    setIsSeoLoading(true);
    Promise.all([
      getSeoSettings().catch(err => {
        console.error('Ошибка загрузки SEO-настроек:', err);
        return null;
      }),
      getYandexStatus().catch(
        () =>
          ({
            connected: false,
            account: null,
            permissions: null,
            connectedAt: null,
          }) as YandexConnectionStatus
      ),
    ]).then(([settings, connection]) => {
      if (settings) setSeoSettings(settings);
      setYandexConnection(connection);
      setIsSeoLoading(false);
    });
  };

  return (
    <div className='flex h-full overflow-hidden'>
      {/* Sidebar Navigation — скрыт в режиме базы знаний */}
      {!isKnowledgeBase && (
        <aside className='w-64 border-r bg-card flex-shrink-0 flex flex-col'>
          <div className='p-4 border-b flex-shrink-0'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
              <Input
                placeholder='Поиск настроек...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>
          </div>

          <ScrollArea className='flex-1 min-h-0'>
            <nav className='p-2'>
              {seoCategories.map(category => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1',
                      isActive
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                    )}
                  >
                    <Icon className='size-4 flex-shrink-0' />
                    <span className='flex-1 text-left'>{category.label}</span>
                  </button>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>
      )}

      {/* Основная область контента */}
      <div className='flex-1 flex flex-col min-w-0 min-h-0'>
        {isKnowledgeBase ? (
          renderCategoryContent()
        ) : (
          <ScrollArea className='flex-1 min-h-0'>
            <div className='max-w-4xl mx-auto p-6 pb-24'>
              {renderCategoryContent()}
            </div>
          </ScrollArea>
        )}

        {/* Фиксированная панель действий */}
        {hasUnsavedChanges && (
          <div className='border-t bg-card p-4 flex items-center justify-between flex-shrink-0'>
            <p className='text-sm text-muted-foreground'>
              У вас есть несохраненные изменения
            </p>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className='size-4 mr-2' />
                Отменить
              </Button>
              <Button size='sm' onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className='size-4 mr-2 animate-spin' />
                ) : (
                  <Save className='size-4 mr-2' />
                )}
                Сохранить изменения
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
