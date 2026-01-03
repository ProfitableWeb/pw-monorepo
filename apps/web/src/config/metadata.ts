import type { Metadata } from 'next';

// Base URL for the application
export const baseUrl = 'https://profitableweb.ru';

// SEO Keywords
export const seoKeywords = [
  'hobby monetization',
  'passive income',
  'side hustle',
  'entrepreneurship',
  'personal finance',
  'creative business',
];

// Core metadata configuration
export const coreMetadata = {
  title: {
    default: 'ProfitableWeb - Monetize Your Hobbies',
    template: '%s | ProfitableWeb',
  },
  description:
    'Research blog documenting insights and strategies for generating financial capital from personal hobbies and passions.',
  siteName: 'ProfitableWeb',
  creator: 'ProfitableWeb Team',
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
    locale: 'en_US',
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
};
