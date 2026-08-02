import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

import '@/styles/globals.scss';
import { metadata as siteMetadata } from '@/config/metadata';
import { Providers } from '@/components/providers';
import { YandexMetrika } from '@/components/seo/YandexMetrika';
import {
  AnalyticsConsentGate,
  CookieConsentBanner,
} from '@/components/common/cookie-consent';
import { getSeoConfig } from '@/lib/seo-config';

// Шрифты подключаются через next/font: Next.js скачивает файлы на этапе сборки
// и раздаёт их со своего origin. Обращений к fonts.googleapis.com / fonts.gstatic.com
// из браузера посетителя не происходит — трансграничной передачи IP и User-Agent нет.
// Кириллица обязательна: весь контент сайта на русском.
// Inter — вариативный шрифт: одна загрузка покрывает все начертания (400/500/600/700
// и остальные), поэтому weight не перечисляем.
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

// Export metadata from configuration
export const metadata: Metadata = siteMetadata;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seoConfig = await getSeoConfig();
  const metrika = seoConfig?.metrikaConfig;

  return (
    <html
      lang='ru'
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <link
          rel='alternate'
          type='application/atom+xml'
          title='ProfitableWeb RSS'
          href='/feed.xml'
        />
        {/* Фолбэк: без JS контент не должен быть скрыт inline-стилями Framer Motion */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: `[style*="opacity: 0"], [style*="opacity:0"] { opacity: 1 !important; transform: none !important; }`,
            }}
          />
        </noscript>
      </head>
      <body>
        <Providers>
          <div className='main-layout'>{children}</div>
        </Providers>
        {/*
          Аналитика монтируется только после явного согласия посетителя
          (п. 1 ч. 1 ст. 6 ФЗ-152). Внутрь шлюза попадает и noscript-пиксель:
          он не должен срабатывать до выбора.
        */}
        {metrika?.counterId && (
          <AnalyticsConsentGate>
            <YandexMetrika
              counterId={metrika.counterId}
              clickmap={metrika.clickmap}
              trackLinks={metrika.trackLinks}
              accurateTrackBounce={metrika.accurateTrackBounce}
              webvisor={metrika.webvisor}
              trackHash={metrika.trackHash}
            />
          </AnalyticsConsentGate>
        )}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
