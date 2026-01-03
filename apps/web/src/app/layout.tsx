import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

import '@/styles/globals.scss';
import { metadata as siteMetadata } from '@/config/metadata';
import { HeadContent } from '@/components/HeadContent';
import { ThemeScript } from '@/utils/theme';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeScript />

        <div className='main-layout'>
          <header className='header'>
            {/* Header will be implemented in future tasks */}
          </header>

          <main className='main-content'>{children}</main>

          <footer className='footer'>
            {/* Footer will be implemented in future tasks */}
          </footer>
        </div>
      </body>
    </html>
  );
}
