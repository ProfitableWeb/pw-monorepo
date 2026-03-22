'use server';

import { highlightCodeBlocks } from '@/lib/code-highlight';

/**
 * Server Action для подсветки кода в превью-странице.
 * Вызывается клиентским компонентом preview/page.tsx,
 * т.к. Shiki работает только на сервере (serverExternalPackages).
 */
export async function highlightCode(html: string): Promise<string> {
  return highlightCodeBlocks(html);
}
