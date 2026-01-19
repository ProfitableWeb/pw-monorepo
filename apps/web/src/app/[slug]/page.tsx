import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AppCategoryPage from '@/components/app-layout/app-category-page';
import ArticlePage from '@/components/app-layout/app-article-page';
import {
  getCategoryBySlug,
  getArticlesByCategory,
  getArticleBySlug,
} from '@/lib/mock-api';
import {
  generateCategoryJsonLd,
  generateArticleJsonLd,
  generateCategoryBreadcrumbJsonLd,
  generateArticleBreadcrumbJsonLd,
} from '@/utils/seo';

// Список статических страниц (обрабатываются Next.js автоматически)
const STATIC_PAGES = ['about', 'contact', 'privacy', 'terms'];

/**
 * Единый динамический роут для категорий и статей
 *
 * Логика разрешения маршрутов:
 * 1. Статические страницы (обрабатываются Next.js автоматически)
 * 2. Категории - приоритетная проверка
 * 3. Статьи - проверка если категория не найдена
 * 4. 404 если ничего не найдено
 *
 * @param params - Параметры маршрута
 * @returns Компонент страницы
 */
export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Проверка на статические страницы (на всякий случай)
  if (STATIC_PAGES.includes(slug)) {
    notFound();
  }

  // Приоритет 1: Проверка категории
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

  // Приоритет 2: Проверка статьи
  const article = await getArticleBySlug(slug);
  if (article) {
    const articleJsonLd = generateArticleJsonLd(article);

    // Получаем категорию для breadcrumbs (если есть)
    const category = article.category
      ? await getCategoryBySlug(article.category)
      : null;

    const breadcrumbJsonLd = category
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
              name: article.title,
              item: `https://profitableweb.ru/${article.slug}`,
            },
          ],
        };

    return (
      <>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <ArticlePage article={article} />
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
