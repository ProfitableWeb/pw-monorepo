/**
 * Оркестратор SEO-раздела.
 * Управляет sidebar-навигацией, маршрутизацией контента по категориям
 * и отображением базы знаний.
 */
import { useHeaderStore } from '@/app/store/header-store';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Settings,
  Users,
  TrendingUp,
  BarChart3,
  LayoutPanelTop,
  SearchCheck,
  Cog,
  Search,
  ChevronRight,
  Save,
  X,
} from 'lucide-react';
import { KnowledgeBase } from './knowledge-base';
import { useNavigationStore } from '@/app/store/navigation-store';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';

import { seoCategories } from './seo.constants';
import { GeneralSeoSettings } from './assets/GeneralSeoSettings';
import { MetaTagsSettings } from './assets/MetaTagsSettings';
import { SitemapSettings } from './assets/SitemapSettings';
import { SchemaSettings } from './assets/SchemaSettings';
import { MonitoringSettings } from './assets/MonitoringSettings';
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
  const isKnowledgeBase = activeCategory === 'knowledge-base';

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
      {
        label: 'Система',
        icon: Cog,
        dropdown: [
          { label: 'Настройки', icon: Settings, href: 'settings' },
          { label: 'Пользователи', icon: Users, href: 'users' },
          { label: 'Продвижение', icon: TrendingUp, href: 'promotion' },
          { label: 'Аналитика', icon: BarChart3, href: 'analytics' },
          { label: 'Реклама', icon: LayoutPanelTop, href: 'ads' },
          { label: 'SEO', icon: SearchCheck, href: 'seo' },
        ],
      },
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
      case 'sitemap':
        return (
          <SitemapSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'schema':
        return (
          <SchemaSettings onChangeDetected={() => setHasUnsavedChanges(true)} />
        );
      case 'monitoring':
        return (
          <MonitoringSettings
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

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    setHasUnsavedChanges(false);
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
                    <ChevronRight
                      className={cn(
                        'size-4 transition-transform flex-shrink-0',
                        isActive && 'rotate-90'
                      )}
                    />
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
              <Button variant='outline' size='sm' onClick={handleCancel}>
                <X className='size-4 mr-2' />
                Отменить
              </Button>
              <Button size='sm' onClick={handleSave}>
                <Save className='size-4 mr-2' />
                Сохранить изменения
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
