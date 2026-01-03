import type { Metadata } from 'next';

// Base URL for the application
export const baseUrl = 'https://profitableweb.ru';

// SEO Keywords
export const seoKeywords = [
  'монетизация хобби',
  'пассивный доход',
  'заработок в интернете',
  'фриланс',
  'предпринимательство',
  'творческий бизнес',
  'side project',
  'AI автоматизация',
  'digital продукты',
];

// Core metadata configuration
export const coreMetadata = {
  title: {
    default: 'ProfitableWeb — Исследовательская лаборатория монетизации труда',
    template: '%s | ProfitableWeb',
  },
  description:
    'Открытая лаборатория по исследованию трансформации труда в эпоху AI-автоматизации. Изучаем механизмы преобразования личных компетенций и призвания в автономные цифровые активы.',
  siteName: 'ProfitableWeb',
  creator: 'ProfitableWeb Research Lab',
  publisher: 'ProfitableWeb',
} as const;

// Social media configuration
export const socialConfig = {
  twitter: {
    site: '@profitableweb',
    creator: '@profitableweb',
  },
  images: {
    og: '/og-image.jpg',
    twitter: '/twitter-image.jpg',
    logo: '/logo.png',
  },
} as const;

// Verification tokens
export const verificationTokens = {
  google: 'google-site-verification-token',
  yandex: 'yandex-verification-token',
} as const;

// JSON-LD structured data
export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: coreMetadata.siteName,
  description: coreMetadata.description,
  url: baseUrl,
  author: {
    '@type': 'Organization',
    name: coreMetadata.creator,
  },
  publisher: {
    '@type': 'Organization',
    name: coreMetadata.publisher,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}${socialConfig.images.logo}`,
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${baseUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
} as const;

// Complete metadata export
export const metadata: Metadata = {
  title: coreMetadata.title,
  description: coreMetadata.description,
  keywords: seoKeywords,
  authors: [{ name: coreMetadata.creator }],
  creator: coreMetadata.creator,
  publisher: coreMetadata.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: baseUrl,
    siteName: coreMetadata.siteName,
    title: coreMetadata.title.default,
    description: coreMetadata.description,
    images: [
      {
        url: socialConfig.images.og,
        width: 1200,
        height: 630,
        alt: coreMetadata.title.default,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: socialConfig.twitter.site,
    creator: socialConfig.twitter.creator,
    title: coreMetadata.title.default,
    description: coreMetadata.description,
    images: [socialConfig.images.twitter],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: verificationTokens,
  icons: {
    icon: [
      { url: '/imgs/favicon/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/imgs/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/imgs/favicon/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/imgs/favicon/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/imgs/favicon/favicon.svg',
      },
    ],
  },
  manifest: '/manifest.json',
};
