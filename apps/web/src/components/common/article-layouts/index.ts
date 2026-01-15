// Main wrapper component
export { ArticleLayout } from './ArticleLayout';

// Individual layout components (можно использовать напрямую)
export { ArticleLayoutThreeColumn } from './ArticleLayoutThreeColumn';
export { ArticleLayoutTwoColumn } from './ArticleLayoutTwoColumn';
export { ArticleLayoutFullWidth } from './ArticleLayoutFullWidth';
export { ArticleLayoutOneColumn } from './ArticleLayoutOneColumn';

// Types
export type {
  ArticleLayoutType,
  BaseArticleLayoutProps,
  ArticleLayoutWithTocProps,
  ArticleLayoutWithSidebarProps,
  ArticleLayoutFullProps,
} from './types';
