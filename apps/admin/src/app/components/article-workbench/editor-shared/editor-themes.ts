/**
 * Темы и настройки для Monaco Editor.
 *
 * Содержит 13 тем (8 тёмных + 5 светлых) с метаданными (label, category, цвета для превью).
 * `defineCustomThemes()` регистрирует кастомные темы при монтировании Monaco —
 * вызывается один раз в `beforeMount` колбэке.
 *
 * Переиспользуется в:
 * - `EditorTab` — полный редактор контента статьи
 * - `CardTab` — мини-редактор excerpt'а в HTML-режиме
 */
import type { Monaco } from '@monaco-editor/react';

export type EditorTheme =
  | 'vs-dark'
  | 'light'
  | 'hc-black'
  | 'monokai'
  | 'dracula'
  | 'github-dark'
  | 'one-dark'
  | 'nord'
  | 'solarized-dark'
  | 'github-light'
  | 'solarized-light'
  | 'one-light'
  | 'nord-light';

export interface ThemeMeta {
  label: string;
  category: 'dark' | 'light';
  colors: [string, string, string];
}

export const THEME_META: Record<EditorTheme, ThemeMeta> = {
  'vs-dark': {
    label: 'VS Dark',
    category: 'dark',
    colors: ['#1E1E1E', '#D4D4D4', '#569CD6'],
  },
  monokai: {
    label: 'Monokai',
    category: 'dark',
    colors: ['#272822', '#F8F8F2', '#F92672'],
  },
  dracula: {
    label: 'Dracula',
    category: 'dark',
    colors: ['#282A36', '#F8F8F2', '#FF79C6'],
  },
  'github-dark': {
    label: 'GitHub Dark',
    category: 'dark',
    colors: ['#0D1117', '#C9D1D9', '#7EE787'],
  },
  'one-dark': {
    label: 'One Dark',
    category: 'dark',
    colors: ['#282C34', '#ABB2BF', '#C678DD'],
  },
  nord: {
    label: 'Nord',
    category: 'dark',
    colors: ['#2E3440', '#D8DEE9', '#81A1C1'],
  },
  'solarized-dark': {
    label: 'Solarized Dark',
    category: 'dark',
    colors: ['#002B36', '#839496', '#2AA198'],
  },
  'hc-black': {
    label: 'Контраст',
    category: 'dark',
    colors: ['#000000', '#FFFFFF', '#569CD6'],
  },
  light: {
    label: 'Светлая',
    category: 'light',
    colors: ['#FFFFFF', '#000000', '#0000FF'],
  },
  'github-light': {
    label: 'GitHub Light',
    category: 'light',
    colors: ['#FFFFFF', '#24292F', '#CF222E'],
  },
  'solarized-light': {
    label: 'Solarized Light',
    category: 'light',
    colors: ['#FDF6E3', '#657B83', '#268BD2'],
  },
  'one-light': {
    label: 'One Light',
    category: 'light',
    colors: ['#FAFAFA', '#383A42', '#A626A4'],
  },
  'nord-light': {
    label: 'Nord Light',
    category: 'light',
    colors: ['#ECEFF4', '#2E3440', '#5E81AC'],
  },
};

export const darkThemes = (
  Object.entries(THEME_META) as [EditorTheme, ThemeMeta][]
).filter(([, m]) => m.category === 'dark');
export const lightThemes = (
  Object.entries(THEME_META) as [EditorTheme, ThemeMeta][]
).filter(([, m]) => m.category === 'light');

export type FormatterType = 'monaco' | 'prettier';

export type HtmlWhitespaceSensitivity = 'css' | 'strict' | 'ignore';

export const FORMATTER_LABELS: Record<FormatterType, string> = {
  prettier: 'Prettier',
  monaco: 'Monaco (встроенный)',
};

export const HTML_WS_LABELS: Record<HtmlWhitespaceSensitivity, string> = {
  css: 'По CSS',
  strict: 'Строгий',
  ignore: 'Игнорировать',
};

export function defineCustomThemes(monaco: Monaco) {
  monaco.editor.defineTheme('monokai', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '75715E', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'F92672' },
      { token: 'string', foreground: 'E6DB74' },
      { token: 'number', foreground: 'AE81FF' },
      { token: 'type', foreground: '66D9EF', fontStyle: 'italic' },
      { token: 'tag', foreground: 'F92672' },
      { token: 'attribute.name', foreground: 'A6E22E' },
      { token: 'attribute.value', foreground: 'E6DB74' },
      { token: 'delimiter', foreground: 'F8F8F2' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#F8F8F2',
      'editor.lineHighlightBackground': '#3E3D32',
      'editorCursor.foreground': '#F8F8F0',
      'editor.selectionBackground': '#49483E',
    },
  });
  monaco.editor.defineTheme('dracula', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272A4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'FF79C6' },
      { token: 'string', foreground: 'F1FA8C' },
      { token: 'number', foreground: 'BD93F9' },
      { token: 'type', foreground: '8BE9FD', fontStyle: 'italic' },
      { token: 'tag', foreground: 'FF79C6' },
      { token: 'attribute.name', foreground: '50FA7B' },
      { token: 'attribute.value', foreground: 'F1FA8C' },
      { token: 'delimiter', foreground: 'F8F8F2' },
    ],
    colors: {
      'editor.background': '#282A36',
      'editor.foreground': '#F8F8F2',
      'editor.lineHighlightBackground': '#44475A',
      'editorCursor.foreground': '#F8F8F0',
      'editor.selectionBackground': '#44475A',
    },
  });
  monaco.editor.defineTheme('github-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8B949E', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'FF7B72' },
      { token: 'string', foreground: 'A5D6FF' },
      { token: 'number', foreground: '79C0FF' },
      { token: 'type', foreground: 'FFA657' },
      { token: 'tag', foreground: '7EE787' },
      { token: 'attribute.name', foreground: '79C0FF' },
      { token: 'attribute.value', foreground: 'A5D6FF' },
      { token: 'delimiter', foreground: 'C9D1D9' },
    ],
    colors: {
      'editor.background': '#0D1117',
      'editor.foreground': '#C9D1D9',
      'editor.lineHighlightBackground': '#161B22',
      'editorCursor.foreground': '#C9D1D9',
      'editor.selectionBackground': '#264F78',
    },
  });
  monaco.editor.defineTheme('one-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5C6370', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'C678DD' },
      { token: 'string', foreground: '98C379' },
      { token: 'number', foreground: 'D19A66' },
      { token: 'type', foreground: 'E5C07B' },
      { token: 'tag', foreground: 'E06C75' },
      { token: 'attribute.name', foreground: 'D19A66' },
      { token: 'attribute.value', foreground: '98C379' },
      { token: 'delimiter', foreground: 'ABB2BF' },
    ],
    colors: {
      'editor.background': '#282C34',
      'editor.foreground': '#ABB2BF',
      'editor.lineHighlightBackground': '#2C313C',
      'editorCursor.foreground': '#528BFF',
      'editor.selectionBackground': '#3E4451',
    },
  });
  monaco.editor.defineTheme('nord', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '616E88', fontStyle: 'italic' },
      { token: 'keyword', foreground: '81A1C1' },
      { token: 'string', foreground: 'A3BE8C' },
      { token: 'number', foreground: 'B48EAD' },
      { token: 'type', foreground: '8FBCBB' },
      { token: 'tag', foreground: '81A1C1' },
      { token: 'attribute.name', foreground: '8FBCBB' },
      { token: 'attribute.value', foreground: 'A3BE8C' },
      { token: 'delimiter', foreground: 'D8DEE9' },
    ],
    colors: {
      'editor.background': '#2E3440',
      'editor.foreground': '#D8DEE9',
      'editor.lineHighlightBackground': '#3B4252',
      'editorCursor.foreground': '#D8DEE9',
      'editor.selectionBackground': '#434C5E',
    },
  });
  monaco.editor.defineTheme('solarized-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '586E75', fontStyle: 'italic' },
      { token: 'keyword', foreground: '859900' },
      { token: 'string', foreground: '2AA198' },
      { token: 'number', foreground: 'D33682' },
      { token: 'type', foreground: 'B58900' },
      { token: 'tag', foreground: '268BD2' },
      { token: 'attribute.name', foreground: '93A1A1' },
      { token: 'attribute.value', foreground: '2AA198' },
      { token: 'delimiter', foreground: '839496' },
    ],
    colors: {
      'editor.background': '#002B36',
      'editor.foreground': '#839496',
      'editor.lineHighlightBackground': '#073642',
      'editorCursor.foreground': '#839496',
      'editor.selectionBackground': '#073642',
    },
  });
  monaco.editor.defineTheme('github-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'CF222E' },
      { token: 'string', foreground: '0A3069' },
      { token: 'number', foreground: '0550AE' },
      { token: 'type', foreground: '953800' },
      { token: 'tag', foreground: '116329' },
      { token: 'attribute.name', foreground: '0550AE' },
      { token: 'attribute.value', foreground: '0A3069' },
      { token: 'delimiter', foreground: '24292F' },
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#24292F',
      'editor.lineHighlightBackground': '#F6F8FA',
      'editorCursor.foreground': '#24292F',
      'editor.selectionBackground': '#BBDFFF',
    },
  });
  monaco.editor.defineTheme('solarized-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '93A1A1', fontStyle: 'italic' },
      { token: 'keyword', foreground: '859900' },
      { token: 'string', foreground: '2AA198' },
      { token: 'number', foreground: 'D33682' },
      { token: 'type', foreground: 'B58900' },
      { token: 'tag', foreground: '268BD2' },
      { token: 'attribute.name', foreground: '657B83' },
      { token: 'attribute.value', foreground: '2AA198' },
      { token: 'delimiter', foreground: '586E75' },
    ],
    colors: {
      'editor.background': '#FDF6E3',
      'editor.foreground': '#657B83',
      'editor.lineHighlightBackground': '#EEE8D5',
      'editorCursor.foreground': '#657B83',
      'editor.selectionBackground': '#EEE8D5',
    },
  });
  monaco.editor.defineTheme('one-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: 'A0A1A7', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'A626A4' },
      { token: 'string', foreground: '50A14F' },
      { token: 'number', foreground: '986801' },
      { token: 'type', foreground: 'C18401' },
      { token: 'tag', foreground: 'E45649' },
      { token: 'attribute.name', foreground: '986801' },
      { token: 'attribute.value', foreground: '50A14F' },
      { token: 'delimiter', foreground: '383A42' },
    ],
    colors: {
      'editor.background': '#FAFAFA',
      'editor.foreground': '#383A42',
      'editor.lineHighlightBackground': '#F2F2F2',
      'editorCursor.foreground': '#526FFF',
      'editor.selectionBackground': '#E5E5E6',
    },
  });
  monaco.editor.defineTheme('nord-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '9DA2AD', fontStyle: 'italic' },
      { token: 'keyword', foreground: '5E81AC' },
      { token: 'string', foreground: 'A3BE8C' },
      { token: 'number', foreground: 'B48EAD' },
      { token: 'type', foreground: '8FBCBB' },
      { token: 'tag', foreground: '81A1C1' },
      { token: 'attribute.name', foreground: '8FBCBB' },
      { token: 'attribute.value', foreground: 'A3BE8C' },
      { token: 'delimiter', foreground: '2E3440' },
    ],
    colors: {
      'editor.background': '#ECEFF4',
      'editor.foreground': '#2E3440',
      'editor.lineHighlightBackground': '#E5E9F0',
      'editorCursor.foreground': '#2E3440',
      'editor.selectionBackground': '#D8DEE9',
    },
  });
}
