import { structuredData } from '@/config/metadata';

interface HeadContentProps {
  themeColor?: string;
}

/**
 * Component responsible for managing the head section content
 * including theme settings, icons, preconnects, and structured data
 */
export function HeadContent({ themeColor = '#3b82f6' }: HeadContentProps) {
  return (
    <>
      {/* Theme and color scheme */}
      <meta name='theme-color' content={themeColor} />
      <meta name='color-scheme' content='light dark' />

      {/* Favicon and app icons */}
      <link rel='icon' href='/imgs/favicon/favicon.ico' />
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/imgs/favicon/apple-touch-icon.svg'
      />
      <link
        rel='icon'
        type='image/svg+xml'
        sizes='32x32'
        href='/imgs/favicon/favicon-32x32.svg'
      />
      <link
        rel='icon'
        type='image/svg+xml'
        sizes='16x16'
        href='/imgs/favicon/favicon-16x16.svg'
      />
      <link rel='manifest' href='/manifest.json' />

      {/* Preconnect to external domains for performance */}
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link
        rel='preconnect'
        href='https://fonts.gstatic.com'
        crossOrigin='anonymous'
      />

      {/* JSON-LD structured data for SEO */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}