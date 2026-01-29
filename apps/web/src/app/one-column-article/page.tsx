import { Metadata } from 'next';
import { ArticlePageOneColumn } from '@/components/app-layout/app-article-page-one-column';
import { getArticleCommentThreads } from '@/lib/mock-api';
import { generateBlogPostingWithCommentsJsonLd } from '@/utils/seo';
import { oneColumnArticleContent } from '@/config/one-column-article-content';

const ARTICLE_URL = 'https://profitableweb.ru/one-column-article';

/**
 * Тестовая страница для одноколоночного лейаута статьи
 *
 * Демонстрирует использование одноколоночного лейаута с блоками 100% ширины
 * и блоком комментариев. Доступна по адресу /one-column-article
 */
export default async function OneColumnArticlePage() {
  const initialThreads = await getArticleCommentThreads('one-column-article');
  const blogPostingJsonLd = generateBlogPostingWithCommentsJsonLd(
    {
      title: oneColumnArticleContent.title,
      description: oneColumnArticleContent.subtitle,
      datePublished: oneColumnArticleContent.publishedAt,
      url: ARTICLE_URL,
    },
    initialThreads
  );

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <ArticlePageOneColumn initialThreads={initialThreads} />
    </>
  );
}

export const metadata: Metadata = {
  title: 'Пример одноколоночной статьи | ProfitableWeb',
  description:
    'Демонстрация возможностей одноколоночного лейаута с блоками 100% ширины',
  openGraph: {
    type: 'article',
    url: 'https://profitableweb.ru/one-column-article',
    title: 'Пример одноколоночной статьи',
    description:
      'Демонстрация возможностей одноколоночного лейаута с блоками 100% ширины',
    siteName: 'ProfitableWeb',
    locale: 'ru_RU',
  },
};
