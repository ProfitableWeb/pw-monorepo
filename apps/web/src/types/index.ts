// Global Type Definitions
// Common TypeScript types used throughout the application

// ===== THEME TYPES =====
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// ===== COMMON UI TYPES =====
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

// ===== LAYOUT TYPES =====
export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface PageLayoutProps extends LayoutProps {
  title?: string;
  description?: string;
  noContainer?: boolean;
}

// ===== NAVIGATION TYPES =====
export interface NavItem {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface NavigationProps {
  items: NavItem[];
  className?: string;
}

// ===== CONTENT TYPES =====
export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subtitle?: string; // Подзаголовок категории
  icon?: string;
  color?: string;
  parent?: string;
  articleCount?: number; // Количество статей в категории
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  featuredImage?: string;
  tags: Tag[];
  category: Category;
  readingTime: number;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface ArticleCardProps {
  article: Omit<Article, 'content'>;
  variant?: 'default' | 'featured' | 'compact';
  showAuthor?: boolean;
  showDate?: boolean;
  showExcerpt?: boolean;
  className?: string;
}

// ===== FORM TYPES =====
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: string) => string | null;
  };
  options?: Array<{ label: string; value: string }>;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  submitLabel?: string;
  loading?: boolean;
  className?: string;
}

// ===== API TYPES =====
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

// ===== SEARCH TYPES =====
export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  type: 'article' | 'page' | 'category';
  relevance: number;
  highlights?: string[];
}

export interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onSelect?: (result: SearchResult) => void;
  results?: SearchResult[];
  loading?: boolean;
  className?: string;
}

// ===== ANALYTICS TYPES =====
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

export interface PageViewEvent {
  page: string;
  title: string;
  referrer?: string;
  userAgent?: string;
}

// ===== UTILITY TYPES =====
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ===== COMPONENT PROP HELPERS =====
export type ComponentWithChildren<T = {}> = T & { children: React.ReactNode };

export type ComponentWithClassName<T = {}> = T & { className?: string };

export type ComponentWithVariant<T extends string, P = {}> = P & {
  variant?: T;
};

// ===== NEXT.JS SPECIFIC TYPES =====
export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[]>;
}

export interface LayoutPropsWithParams {
  children: React.ReactNode;
  params: Record<string, string>;
}

// ===== CONFIGURATION TYPES =====
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  author: {
    name: string;
    email: string;
  };
  navigation: NavItem[];
}

export interface FeatureFlags {
  comments: boolean;
  newsletter: boolean;
  search: boolean;
  analytics: boolean;
  darkMode: boolean;
}
