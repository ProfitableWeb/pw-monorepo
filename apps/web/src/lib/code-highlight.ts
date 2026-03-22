import {
  createHighlighter,
  type Highlighter,
  type ThemeRegistration,
} from 'shiki';
import pwLight from './shiki-themes/pw-light.json';
import pwDark from './shiki-themes/pw-dark.json';

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Singleton Shiki highlighter с lazy initialization.
 * Использует кастомные PW-темы (зелёно-серая палитра бренда).
 */
function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [
        pwLight as unknown as ThemeRegistration,
        pwDark as unknown as ThemeRegistration,
      ],
      langs: [
        'javascript',
        'typescript',
        'python',
        'html',
        'css',
        'json',
        'bash',
        'sql',
        'yaml',
        'markdown',
        'jsx',
        'tsx',
      ],
    });
  }
  return highlighterPromise;
}

/**
 * Извлекает язык из class="language-xxx" атрибута.
 * Поддерживает форматы: language-js, lang-python, просто "javascript".
 */
function extractLanguage(classAttr: string): string | null {
  const match = classAttr.match(/(?:language-|lang-)(\w+)/);
  return match?.[1] ? normalizeLanguage(match[1]) : null;
}

/** Маппинг коротких алиасов языков к полным именам Shiki */
function normalizeLanguage(lang: string): string {
  const aliases: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    sh: 'bash',
    shell: 'bash',
    yml: 'yaml',
    md: 'markdown',
  };
  return aliases[lang] || lang;
}

/**
 * Обрабатывает HTML статьи: находит блоки <pre><code> и применяет
 * подсветку синтаксиса через Shiki с поддержкой dual themes.
 *
 * Shiki генерирует CSS-переменные --shiki-light / --shiki-dark,
 * переключение тем происходит через CSS без клиентского JS.
 */
export async function highlightCodeBlocks(html: string): Promise<string> {
  // Быстрая проверка — если нет блоков кода, возвращаем как есть
  if (!html.includes('<pre>') && !html.includes('<code')) {
    return html;
  }

  const highlighter = await getHighlighter();
  const loadedLangs = highlighter.getLoadedLanguages();

  // Regex для <pre><code class="language-xxx">...</code></pre>
  // Также обрабатывает <pre><code> без класса (plain text)
  return html.replace(
    /<pre([^>]*)><code([^>]*)>([\s\S]*?)<\/code><\/pre>/gi,
    (_match, preAttrs, codeAttrs, codeContent) => {
      const lang = extractLanguage(codeAttrs || preAttrs || '');

      // Декодируем HTML-сущности обратно в текст для Shiki
      const decoded = codeContent
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&nbsp;/g, ' ');

      // Если язык не поддерживается — возвращаем как есть
      if (lang && !loadedLangs.includes(lang)) {
        return _match;
      }

      try {
        const highlighted = highlighter.codeToHtml(decoded, {
          lang: lang || 'text',
          themes: {
            light: 'pw-light',
            dark: 'pw-dark',
          },
          defaultColor: false,
        });

        return highlighted;
      } catch {
        // Fallback — возвращаем оригинал если Shiki не справился
        return _match;
      }
    }
  );
}
