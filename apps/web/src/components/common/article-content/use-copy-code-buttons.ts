import { useEffect, type RefObject } from 'react';

const COPY_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const CHECK_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

/**
 * Добавляет кнопку «Копировать» к каждому Shiki-блоку кода.
 * Кнопка плавно появляется при наведении на блок.
 *
 * Работает через DOM-манипуляцию, т.к. контент рендерится
 * через dangerouslySetInnerHTML и React не управляет дочерними нодами.
 */
export function useCopyCodeButtons(
  containerRef: RefObject<HTMLElement | null>,
  contentHtml: string
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const shikiBlocks = container.querySelectorAll<HTMLElement>('.shiki');
    const cleanups: (() => void)[] = [];

    shikiBlocks.forEach(block => {
      if (block.querySelector('.copy-code-btn')) return;

      block.style.position = 'relative';

      const btn = document.createElement('button');
      btn.className = 'copy-code-btn';
      btn.setAttribute('aria-label', 'Копировать код');
      btn.type = 'button';
      btn.innerHTML = COPY_ICON;

      const handleClick = async () => {
        const code = block.querySelector('code');
        const text = code?.textContent || block.textContent || '';

        try {
          await navigator.clipboard.writeText(text);
          btn.innerHTML = CHECK_ICON;
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = COPY_ICON;
            btn.classList.remove('copied');
          }, 2000);
        } catch {
          // Clipboard API недоступен — тихо игнорируем
        }
      };

      btn.addEventListener('click', handleClick);
      block.appendChild(btn);

      cleanups.push(() => {
        btn.removeEventListener('click', handleClick);
        btn.remove();
      });
    });

    return () => {
      cleanups.forEach(fn => fn());
    };
  }, [containerRef, contentHtml]);
}
