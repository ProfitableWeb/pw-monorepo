/**
 * PW-074 | Согласие посетителя на использование файлов cookie.
 *
 * Технические cookie (сессия, авторизация, защита форм) обрабатываются на основании
 * п. 5 ч. 1 ст. 6 ФЗ-152 и согласия не требуют. Аналитические cookie (Яндекс.Метрика)
 * обрабатываются на основании согласия субъекта (п. 1 ч. 1 ст. 6 ФЗ-152), поэтому
 * счётчик не должен монтироваться, пока посетитель не выразил волю явно.
 *
 * Модуль намеренно не зависит от React: его импортируют и клиентские компоненты,
 * и (потенциально) серверный код. Все обращения к window защищены проверками.
 */

/** Выбор посетителя. Отсутствие записи (null) означает «выбор ещё не сделан». */
export type CookieConsent = 'accepted' | 'necessary-only';

/** Ключ в localStorage. */
export const COOKIE_CONSENT_STORAGE_KEY = 'pw-cookie-consent';

/**
 * Версия запроса согласия. Повышать при изменении состава cookie или объёма
 * обработки — тогда ранее сохранённый выбор перестанет действовать и баннер
 * покажется снова (согласие должно быть информированным).
 */
export const COOKIE_CONSENT_VERSION = 1;

/** Событие «открыть настройки cookie» — им управляет ссылка в футере. */
export const COOKIE_SETTINGS_EVENT = 'pw:cookie-settings-open';

interface StoredConsent {
  value: CookieConsent;
  version: number;
  decidedAt: string;
}

function isConsentValue(value: unknown): value is CookieConsent {
  return value === 'accepted' || value === 'necessary-only';
}

// ---------------------------------------------------------------------------
// Внешнее хранилище для useSyncExternalStore
// ---------------------------------------------------------------------------

let snapshot: CookieConsent | null = null;
let snapshotRead = false;
let storageBound = false;

const listeners = new Set<() => void>();

function readFromStorage(): CookieConsent | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    return isConsentValue(parsed.value) ? parsed.value : null;
  } catch {
    // Повреждённая запись или недоступное хранилище — считаем, что выбора нет.
    return null;
  }
}

function emit(): void {
  listeners.forEach(listener => listener());
}

function handleStorageEvent(event: StorageEvent): void {
  // event.key === null означает localStorage.clear()
  if (event.key !== null && event.key !== COOKIE_CONSENT_STORAGE_KEY) return;

  const next = readFromStorage();
  if (next === snapshot) return;

  snapshot = next;
  snapshotRead = true;
  emit();
}

/**
 * Подписка на изменение выбора. Слушатель `storage` привязывается один раз
 * на модуль — он синхронизирует вкладки между собой.
 */
export function subscribeCookieConsent(listener: () => void): () => void {
  listeners.add(listener);

  if (!storageBound && typeof window !== 'undefined') {
    storageBound = true;
    window.addEventListener('storage', handleStorageEvent);
  }

  return () => {
    listeners.delete(listener);
  };
}

/** Снимок на клиенте. Значение кэшируется — useSyncExternalStore требует стабильности. */
export function getCookieConsentSnapshot(): CookieConsent | null {
  if (!snapshotRead) {
    snapshot = readFromStorage();
    snapshotRead = true;
  }
  return snapshot;
}

/**
 * Снимок на сервере — всегда null: во время SSR выбор посетителя неизвестен,
 * поэтому аналитика в серверную разметку не попадает ни при каких условиях.
 * Это же гарантирует, что noscript-пиксель не сработает без согласия.
 */
export function getCookieConsentServerSnapshot(): CookieConsent | null {
  return null;
}

/** Сохранить выбор посетителя и уведомить подписчиков. */
export function setCookieConsent(value: CookieConsent): void {
  if (typeof window === 'undefined') return;

  const payload: StoredConsent = {
    value,
    version: COOKIE_CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(payload)
    );
  } catch {
    // Приватный режим или переполненное хранилище: выбор действует до перезагрузки.
    // Молча продолжаем — отказ в записи не должен блокировать интерфейс.
  }

  snapshot = value;
  snapshotRead = true;
  emit();
}

/**
 * Удалить идентификаторы Яндекс.Метрики при отзыве согласия.
 *
 * Счётчик ставит cookie вида `_ym_uid`, `_ym_d`, `_ym_isad`, `_ym_visorc` на домен
 * сайта. После отзыва согласия хранить их незачем: основание обработки отпало.
 * Значение cookie доступно скриптам (HttpOnly Метрика не ставит), поэтому чистим
 * из браузера — и по текущему домену, и по варианту с ведущей точкой.
 */
export function clearAnalyticsCookies(): void {
  if (typeof document === 'undefined') return;

  const names = document.cookie
    .split(';')
    .map(part => part.split('=')[0]?.trim())
    .filter((name): name is string => !!name && name.startsWith('_ym_'));

  const host = window.location.hostname;
  const domains = [undefined, host, `.${host}`];

  for (const name of names) {
    for (const domain of domains) {
      document.cookie =
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
        (domain ? `; domain=${domain}` : '');
    }
  }
}

/** Открыть баннер повторно (ссылка «Настройки cookie» в футере). */
export function openCookieSettings(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT));
}
