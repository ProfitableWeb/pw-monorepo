'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    /**
     * Идентификатор целевой секции, снятый из хэша блокирующим скриптом
     * в PrivacyPage до разбора разметки. См. комментарий там же.
     */
    __pwAnchorTarget?: string;
  }
}

/**
 * PW-074 | Навигация по якорю на длинном документе.
 *
 * Политика состоит из 15 разделов, и переход по ссылке вида `/privacy#section-id`
 * (из cookie-баннера) бросает посетителя в середину сплошного текста без единого
 * признака, почему он там оказался. Компонент решает обе половины проблемы:
 *
 * 1. Отменяет нативный мгновенный прыжок браузера и прокручивает страницу
 *    сверху вниз до нужного раздела — переход становится читаемым движением.
 * 2. Подсвечивает заголовок целевого раздела зелёным маркером: резкая вспышка
 *    по прибытии, затем медленное затухание. Это фиксирует, куда отослал якорь.
 *
 * Важно: страница прокручивается не окном, а контейнером `.main-layout`
 * (`overflow-y: auto`) — `window.scrollTo` здесь холостой, а `scrollend`
 * не всплывает до `document`. Поэтому контейнер вычисляется явно.
 *
 * Рендерит `null` — работает только через побочные эффекты.
 * Анимация отключается при `prefers-reduced-motion: reduce`.
 */

/** Класс-триггер CSS-анимации маркера, снимается после её завершения. */
const HIGHLIGHT_CLASS = 'privacy-page__section--anchor-target';

/** Должно совпадать с длительностью `privacy-anchor-flash` в PrivacyPage.scss. */
const HIGHLIGHT_DURATION_MS = 2800;

/** Пауза перед стартом прокрутки — даёт браузеру отрисовать верх страницы. */
const SCROLL_START_DELAY_MS = 120;

/** Запас на плавную прокрутку, если браузер не поддерживает событие `scrollend`. */
const SCROLL_FALLBACK_MS = 1200;

/**
 * Ищет ближайшего прокручиваемого предка. Возвращает `null`, если страницу
 * скроллит сам документ — тогда работают window-методы.
 */
const findScrollContainer = (node: HTMLElement): HTMLElement | null => {
  let el = node.parentElement;
  while (el && el !== document.body) {
    const { overflowY } = getComputedStyle(el);
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      el.scrollHeight > el.clientHeight
    ) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
};

const AnchorHighlight = () => {
  useEffect(() => {
    // Хэш снят блокирующим скриптом ещё до разбора секций — берём цель оттуда.
    // Фолбэк на location.hash: клиентская навигация внутри приложения тот
    // скрипт не выполняет, там хэш остаётся на месте.
    const hash = window.__pwAnchorTarget ?? window.location.hash.slice(1);
    delete window.__pwAnchorTarget;
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    /** Возвращает хэш в адресную строку — ссылку можно скопировать и переслать. */
    const restoreHash = () => {
      if (window.location.hash.slice(1) === hash) return;
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}#${hash}`
      );
    };

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const container = findScrollContainer(target);
    const scroller: HTMLElement | Document = container ?? document;

    // Страховка на случай клиентской навигации: там блокирующий скрипт не
    // отрабатывает, хэш остаётся и браузер может прыгнуть сам. При обычной
    // загрузке хэша уже нет, прокрутка и так в начале — присваивание вхолостую.
    if (!prefersReducedMotion) {
      if (container) {
        container.scrollTop = 0;
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    }

    let highlightTimer: number | undefined;
    let arrivalTimer: number | undefined;
    let onScrollEnd: (() => void) | undefined;

    /** Вспышка запускается по прибытии, иначе она отгорит по дороге. */
    const flashOnArrival = () => {
      restoreHash();
      target.classList.add(HIGHLIGHT_CLASS);
      highlightTimer = window.setTimeout(() => {
        target.classList.remove(HIGHLIGHT_CLASS);
      }, HIGHLIGHT_DURATION_MS);
    };

    const scrollTimer = window.setTimeout(
      () => {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });

        if (prefersReducedMotion) {
          flashOnArrival();
          return;
        }

        // `scrollend` поддержан не везде — держим таймер запасным путём
        // и снимаем то, что не сработало первым.
        const finish = () => {
          if (arrivalTimer) window.clearTimeout(arrivalTimer);
          if (onScrollEnd)
            scroller.removeEventListener('scrollend', onScrollEnd);
          flashOnArrival();
        };

        onScrollEnd = finish;
        scroller.addEventListener('scrollend', finish, { once: true });
        arrivalTimer = window.setTimeout(finish, SCROLL_FALLBACK_MS);
      },
      prefersReducedMotion ? 0 : SCROLL_START_DELAY_MS
    );

    return () => {
      window.clearTimeout(scrollTimer);
      if (arrivalTimer) window.clearTimeout(arrivalTimer);
      if (highlightTimer) window.clearTimeout(highlightTimer);
      if (onScrollEnd) scroller.removeEventListener('scrollend', onScrollEnd);
      target.classList.remove(HIGHLIGHT_CLASS);
    };
  }, []);

  return null;
};

export default AnchorHighlight;
