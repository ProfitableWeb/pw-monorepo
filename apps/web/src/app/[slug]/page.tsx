import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AppCategoryPage from '@/components/app-layout/app-category-page';
import ArticlePage from '@/components/app-layout/app-article-page';

export const dynamic = 'force-dynamic';
import {
  getCategoryBySlug,
  getArticlesByCategory,
  getArticleBySlug,
  getFullArticleBySlug,
  getPageBySlug,
} from '@/lib/api-client';
import {
  generateCategoryJsonLd,
  generateArticleJsonLd,
  generateCategoryBreadcrumbJsonLd,
  generateArticleBreadcrumbJsonLd,
} from '@/utils/seo';

/**
 * Единый динамический роут для категорий, статей и страниц (type=page)
 *
 * Логика разрешения маршрутов:
 * 1. Страницы (type=page) — /about, /privacy и т.д.
 * 2. Категории
 * 3. Статьи
 * 4. 404 если ничего не найдено
 */
export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Приоритет 1: Проверка страницы (type=page)
  const page = await getPageBySlug(slug);
  if (page) {
    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Главная',
          item: 'https://profitableweb.ru/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.title,
          item: `https://profitableweb.ru/${page.slug}`,
        },
      ],
    };

    return (
      <>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <ArticlePage article={page} />
      </>
    );
  }

  // Приоритет 2: Проверка категории
  const category = await getCategoryBySlug(slug);
  if (category) {
    const articles = await getArticlesByCategory(category.slug);
    const categoryJsonLd = generateCategoryJsonLd(category, articles);
    const breadcrumbJsonLd = generateCategoryBreadcrumbJsonLd(category);

    return (
      <>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <AppCategoryPage category={category} articles={articles} />
      </>
    );
  }

  // Приоритет 3: Проверка статьи (полная версия с content, toc, artifacts)
  const fullArticle = await getFullArticleBySlug(slug);
  if (fullArticle) {
    // Для JSON-LD нужен masonry-тип Article — получим его тоже
    const article = await getArticleBySlug(slug);
    const articleJsonLd = article ? generateArticleJsonLd(article) : null;

    // Получаем категорию для breadcrumbs (если есть)
    const category = fullArticle.category
      ? await getCategoryBySlug(fullArticle.category)
      : null;

    const breadcrumbJsonLd =
      category && article
        ? generateArticleBreadcrumbJsonLd(article, category)
        : {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Главная',
                item: 'https://profitableweb.ru/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: fullArticle.title,
                item: `https://profitableweb.ru/${fullArticle.slug}`,
              },
            ],
          };

    return (
      <>
        {articleJsonLd && (
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          />
        )}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <ArticlePage article={fullArticle} categoryName={category?.name} />
      </>
    );
  }

  // Если ничего не найдено - 404
  notFound();
}

/**
 * Генерация метаданных для SEO
 *
 * Генерирует мета-теги в зависимости от типа контента (категория или статья)
 *
 * @param params - Параметры маршрута
 * @returns Метаданные страницы
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Проверка страницы (type=page)
  const page = await getPageBySlug(slug);
  if (page) {
    return {
      title: `${page.title} | ProfitableWeb`,
      description: page.subtitle || page.excerpt,
      openGraph: {
        type: 'website',
        url: `https://profitableweb.ru/${page.slug}`,
        title: page.title,
        description: page.subtitle || page.excerpt,
        siteName: 'ProfitableWeb',
        locale: 'ru_RU',
        ...(page.imageUrl ? { images: [page.imageUrl] } : {}),
      },
    };
  }

  // Проверка категории
  const category = await getCategoryBySlug(slug);
  if (category) {
    return {
      title: `${category.name} | ProfitableWeb`,
      description:
        category.description ||
        `Статьи по категории ${category.name} на ProfitableWeb`,
      openGraph: {
        type: 'website',
        url: `https://profitableweb.ru/${category.slug}`,
        title: category.name,
        description: category.description,
        siteName: 'ProfitableWeb',
        locale: 'ru_RU',
      },
      twitter: {
        card: 'summary_large_image',
        title: category.name,
        description: category.description,
      },
    };
  }

  // Проверка статьи
  const article = await getArticleBySlug(slug);
  if (article) {
    return {
      title: `${article.title} | ProfitableWeb`,
      description: article.subtitle,
      openGraph: {
        type: 'article',
        url: `https://profitableweb.ru/${article.slug}`,
        title: article.title,
        description: article.subtitle,
        publishedTime: article.createdAt,
        authors: ['ProfitableWeb'],
        siteName: 'ProfitableWeb',
        locale: 'ru_RU',
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.subtitle,
      },
    };
  }

  return {
    title: 'Страница не найдена | ProfitableWeb',
  };
}
