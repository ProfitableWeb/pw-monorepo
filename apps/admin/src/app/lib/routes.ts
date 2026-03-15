/**
 * Утилиты URL-роутинга — маппинг PageId ↔ URL pathname.
 *
 * Админка использует History API + Zustand (без react-router-dom).
 * Все пути относительны к базовому `/admin/`.
 *
 * @see navigation.constants.ts — navigationItems.path содержит паттерны маршрутов
 * @see navigation-store.ts — pushState вызывается из navigateTo
 */
import { type PageId, navigationItems } from '@/app/store/navigation.constants';

const BASE = '/admin';

/** Параметрические маршруты — выводятся из navigationItems.path с `:param` */
const PARAMETRIC_ROUTES = navigationItems
  .filter(i => i.path.includes(':'))
  .map(i => {
    const colonIdx = i.path.lastIndexOf(':');
    const slashIdx = i.path.lastIndexOf('/', colonIdx);
    return {
      pageId: i.id,
      prefix: i.path.slice(0, slashIdx + 1),
      paramKey: i.path.slice(colonIdx + 1),
    };
  });

/** Построить URL из PageId + опциональных параметров */
export function pageIdToUrl(
  pageId: PageId,
  params?: Record<string, string>
): string {
  const item = navigationItems.find(i => i.id === pageId);
  if (!item) return BASE;

  let path = item.path;

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, value);
    }
  }

  // Удалить оставшиеся :param (если нет значения — напр. new article)
  path = path.replace(/\/:[^/]+/g, '');

  return path ? `${BASE}/${path}` : BASE;
}

/** Распарсить pathname → PageId + параметры. null если маршрут не найден */
export function urlToPageId(
  pathname: string
): { pageId: PageId; params?: Record<string, string> } | null {
  let relative = pathname.startsWith(BASE)
    ? pathname.slice(BASE.length)
    : pathname;
  if (relative.startsWith('/')) relative = relative.slice(1);
  if (relative.endsWith('/')) relative = relative.slice(0, -1);

  if (!relative) {
    return { pageId: 'dashboard' };
  }

  // Сначала параметрические маршруты (content/articles/uuid)
  for (const route of PARAMETRIC_ROUTES) {
    if (
      relative.startsWith(route.prefix) &&
      relative !== route.prefix.slice(0, -1)
    ) {
      const paramValue = relative.slice(route.prefix.length);
      if (paramValue && !paramValue.includes('/')) {
        return {
          pageId: route.pageId,
          params: { [route.paramKey]: paramValue },
        };
      }
    }
  }

  // Точное совпадение среди статических маршрутов
  const item = navigationItems.find(
    i => i.path === relative && !i.path.includes(':')
  );
  if (item) {
    return { pageId: item.id };
  }

  return null;
}
