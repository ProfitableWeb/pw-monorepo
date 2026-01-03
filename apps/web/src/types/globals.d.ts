// Global type declarations for the Next.js application

// ===== MODULE DECLARATIONS =====

// SCSS module declarations
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

// Global SCSS files (non-module)
declare module '../../styles/globals.scss';
declare module '@/styles/globals.scss';
declare module '*/styles/*';

declare module '*.sass' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Image file declarations
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

// Font file declarations
declare module '*.woff' {
  const src: string;
  export default src;
}

declare module '*.woff2' {
  const src: string;
  export default src;
}

declare module '*.eot' {
  const src: string;
  export default src;
}

declare module '*.ttf' {
  const src: string;
  export default src;
}

declare module '*.otf' {
  const src: string;
  export default src;
}

// ===== GLOBAL INTERFACE EXTENSIONS =====

// Extend the Window interface for global variables
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    // Add other global variables as needed
  }
}

// ===== ENVIRONMENT VARIABLES =====
declare namespace NodeJS {
  interface ProcessEnv {
    // Application settings
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_DESCRIPTION: string;

    // API configuration
    NEXT_PUBLIC_API_URL: string;

    // Analytics
    NEXT_PUBLIC_GA_ID?: string;
    NEXT_PUBLIC_GTM_ID?: string;

    // SEO & Social
    NEXT_PUBLIC_OG_IMAGE_URL: string;
    NEXT_PUBLIC_TWITTER_HANDLE: string;

    // Development settings
    NEXT_PUBLIC_DEBUG_MODE: string;
    NEXT_PUBLIC_FEATURE_COMMENTS: string;
    NEXT_PUBLIC_FEATURE_NEWSLETTER: string;
    NEXT_PUBLIC_FEATURE_SEARCH: string;

    // Timezone and locale
    NEXT_PUBLIC_TIMEZONE: string;
    NEXT_PUBLIC_DEFAULT_LOCALE: string;

    // Server-side only variables
    SESSION_SECRET?: string;
    DATABASE_URL?: string;
    EMAIL_SERVICE_API_KEY?: string;
    SEARCH_API_KEY?: string;
    SENTRY_DSN?: string;

    // OAuth providers
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
  }
}

export {};
