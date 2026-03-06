import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/components/layout/theme-provider';
import { cn } from '@/app/components/ui/utils';
import faviconUrl from '@/app/assets/favicon.svg';

interface SerpPreviewProps {
  title: string;
  slug: string;
  description: string;
}

type SearchEngine = 'google' | 'yandex';
type PreviewTheme = 'light' | 'dark';

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

const themes = {
  google: {
    light: { bg: '#ffffff', title: '#1a0dab', url: '#006621', desc: '#545454' },
    dark: { bg: '#202124', title: '#8ab4f8', url: '#99c794', desc: '#bdc1c6' },
  },
  yandex: {
    light: { bg: '#ffffff', title: '#0000CC', desc: '#333333', url: '#060' },
    dark: { bg: '#1e1e1e', title: '#6b9eff', desc: '#a0a0a0', url: '#5c9e31' },
  },
};

function GoogleSerp({
  title,
  slug,
  description,
  theme,
}: SerpPreviewProps & { theme: PreviewTheme }) {
  const displayTitle = truncate(title || 'Заголовок страницы', 60);
  const displayDesc = truncate(
    description || 'Описание страницы для поисковой выдачи...',
    160
  );
  const displayUrl = slug
    ? `profitableweb.ru › ${slug.replace(/-/g, '‑').slice(0, 40)}`
    : 'profitableweb.ru';
  const c = themes.google[theme];

  return (
    <div className='space-y-0.5 font-[Arial,sans-serif]'>
      <div className='flex items-center gap-2 mb-1'>
        <img
          src={faviconUrl}
          alt=''
          className='size-7 rounded-full border border-black/5'
        />
        <div className='min-w-0'>
          <div
            className='text-[13px] leading-tight truncate'
            style={{ color: c.desc }}
          >
            ProfitableWeb
          </div>
          <div className='text-[12px] leading-tight' style={{ color: c.url }}>
            {displayUrl}
          </div>
        </div>
      </div>
      <div
        className='text-[18px] leading-[1.3] font-normal cursor-pointer hover:underline'
        style={{ color: c.title }}
      >
        {displayTitle}
      </div>
      <div className='text-[13px] leading-[1.5]' style={{ color: c.desc }}>
        {displayDesc}
      </div>
    </div>
  );
}

function YandexSerp({
  title,
  slug,
  description,
  theme,
}: SerpPreviewProps & { theme: PreviewTheme }) {
  const displayTitle = truncate(title || 'Заголовок страницы', 56);
  const displayDesc = truncate(
    description || 'Описание страницы для поисковой выдачи...',
    160
  );
  const displayUrl = slug
    ? `profitableweb.ru/${slug.slice(0, 40)}`
    : 'profitableweb.ru';
  const c = themes.yandex[theme];

  return (
    <div className='space-y-1.5'>
      {/* Строка сайта: фавикон + название + URL */}
      <div className='flex items-start gap-2'>
        <img
          src={faviconUrl}
          alt=''
          className='size-4 rounded shrink-0 mt-0.5'
        />
        <div className='min-w-0'>
          <div
            className='text-[13px] leading-tight font-medium truncate'
            style={{ color: theme === 'dark' ? '#e0e0e0' : '#000' }}
          >
            profitableweb.ru
          </div>
          <div
            className='text-[12px] leading-tight opacity-50'
            style={{ color: c.desc }}
          >
            {displayUrl}
          </div>
        </div>
      </div>
      {/* Заголовок страницы */}
      <div
        className='text-[16px] leading-[1.3] font-medium cursor-pointer hover:underline'
        style={{ color: c.title }}
      >
        {displayTitle}
      </div>
      {/* Сниппет описания */}
      <div className='text-[13px] leading-[1.5]' style={{ color: c.desc }}>
        {displayDesc}
      </div>
    </div>
  );
}

export function SerpPreview(props: SerpPreviewProps) {
  const [engine, setEngine] = useState<SearchEngine>('yandex');
  const { resolvedTheme } = useTheme();
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>(
    resolvedTheme === 'dark' ? 'dark' : 'light'
  );

  const toggleTheme = () =>
    setPreviewTheme(t => (t === 'light' ? 'dark' : 'light'));
  const cardBg =
    previewTheme === 'dark' ? themes[engine].dark.bg : themes[engine].light.bg;

  return (
    <div className='space-y-3 group/serp'>
      <div className='flex items-center gap-1'>
        <button
          type='button'
          onClick={() => setEngine('yandex')}
          className={cn(
            'px-2.5 py-1 rounded text-xs font-medium transition-colors',
            engine === 'yandex'
              ? 'bg-foreground/10 text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Яндекс
        </button>
        <button
          type='button'
          onClick={() => setEngine('google')}
          className={cn(
            'px-2.5 py-1 rounded text-xs font-medium transition-colors',
            engine === 'google'
              ? 'bg-foreground/10 text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Google
        </button>

        <div className='flex-1' />

        <button
          type='button'
          onClick={toggleTheme}
          className='p-1 rounded text-muted-foreground/50 hover:text-foreground transition-colors'
          title={previewTheme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        >
          {previewTheme === 'light' ? (
            <Moon className='size-3.5' />
          ) : (
            <Sun className='size-3.5' />
          )}
        </button>
      </div>

      <div
        className='rounded-lg border p-4 transition-[filter] duration-300 grayscale group-hover/serp:grayscale-0'
        style={{ background: cardBg }}
      >
        {engine === 'google' ? (
          <GoogleSerp {...props} theme={previewTheme} />
        ) : (
          <YandexSerp {...props} theme={previewTheme} />
        )}
      </div>
    </div>
  );
}
