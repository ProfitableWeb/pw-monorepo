/**
 * Стор навигации — клиентский роутинг админ-панели.
 *
 * Вместо файлового роутинга используется Zustand-стор с `navigateTo(pageId)`.
 * Типы и данные навигации — в `navigation.constants.ts`.
 * Утилиты маршрутизации — в `lib/routes.ts`.
 * История последних 5 страниц хранится в `recentPages` для быстрого возврата.
 */
import { create } from 'zustand';
import { pageIdToUrl } from '@/app/lib/routes';
import {
  type PageId,
  type NavigationItem,
  navigationItems,
} from '@/app/store/navigation.constants';

// Реэкспорт для обратной совместимости — все существующие импортеры продолжают работать
export { type PageId, type NavigationItem, navigationItems };

interface NavigateOptions {
  /** Не вызывать history.pushState (для popstate и начальной загрузки) */
  skipPush?: boolean;
}

interface NavigationStore {
  currentPage: PageId;
  recentPages: PageId[];
  seoKbArticleId?: string;
  editArticleId?: string;
  navigateTo: (pageId: PageId, options?: NavigateOptions) => void;
  navigateToArticleEditor: (
    articleId?: string,
    options?: NavigateOptions
  ) => void;
  navigateToResearchWorkspace: (
    researchId: string,
    options?: NavigateOptions
  ) => void;
  navigateToSeoKb: (articleId: string, options?: NavigateOptions) => void;
  clearSeoKbArticleId: () => void;
  getPageTitle: (pageId: PageId) => string;
  getNavigationItem: (pageId: PageId) => NavigationItem | undefined;
}

function pushUrl(pageId: PageId, url: string) {
  window.history.pushState({ pageId }, '', url);
}

export const useNavigationStore = create<NavigationStore>(set => ({
  currentPage: 'dashboard',
  recentPages: [],
  seoKbArticleId: undefined,
  editArticleId: undefined,

  navigateTo: (pageId: PageId, options?: NavigateOptions) => {
    set(state => {
      const recentPages = [
        pageId,
        ...state.recentPages.filter(p => p !== pageId),
      ].slice(0, 5);
      return { currentPage: pageId, recentPages };
    });
    if (!options?.skipPush) {
      pushUrl(pageId, pageIdToUrl(pageId));
    }
  },

  navigateToSeoKb: (articleId: string, options?: NavigateOptions) => {
    set(state => {
      const recentPages = [
        'seo' as PageId,
        ...state.recentPages.filter(p => p !== 'seo'),
      ].slice(0, 5);
      return { currentPage: 'seo', recentPages, seoKbArticleId: articleId };
    });
    if (!options?.skipPush) {
      pushUrl('seo', pageIdToUrl('seo'));
    }
  },

  navigateToArticleEditor: (articleId?: string, options?: NavigateOptions) => {
    set(state => {
      const recentPages = [
        'article-editor' as PageId,
        ...state.recentPages.filter(p => p !== 'article-editor'),
      ].slice(0, 5);
      return {
        currentPage: 'article-editor',
        recentPages,
        editArticleId: articleId,
      };
    });
    if (!options?.skipPush) {
      const url = articleId
        ? pageIdToUrl('article-editor', { id: articleId })
        : pageIdToUrl('article-editor', { id: 'new' });
      pushUrl('article-editor', url);
    }
  },

  navigateToResearchWorkspace: (
    researchId: string,
    options?: NavigateOptions
  ) => {
    set(state => {
      const recentPages = [
        'research-workspace' as PageId,
        ...state.recentPages.filter(p => p !== 'research-workspace'),
      ].slice(0, 5);
      return {
        currentPage: 'research-workspace',
        recentPages,
      };
    });
    if (!options?.skipPush) {
      pushUrl(
        'research-workspace',
        pageIdToUrl('research-workspace', { id: researchId })
      );
    }
  },

  clearSeoKbArticleId: () => {
    set({ seoKbArticleId: undefined });
  },

  getPageTitle: (pageId: PageId) => {
    const item = navigationItems.find(item => item.id === pageId);
    return item?.title || 'Панель управления';
  },

  getNavigationItem: (pageId: PageId) => {
    return navigationItems.find(item => item.id === pageId);
  },
}));
