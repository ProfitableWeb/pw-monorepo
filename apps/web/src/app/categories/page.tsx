import { Metadata } from 'next';
import AppCategoriesPage from '@/components/app-layout/app-categories-page';
import { getAllCategories } from '@/lib/api-client';

export const dynamic = 'force-dynamic';
import {
  generateCategoriesJsonLd,
  generateCategoriesBreadcrumbJsonLd,
} from '@/utils/seo';

/**
 * Страница категорий статей - каталог всех категорий
 */
export default async function CategoriesPage() {
  const categories = await getAllCategories();

  const categoriesJsonLd = generateCategoriesJsonLd(categories);
  const breadcrumbJsonLd = generateCategoriesBreadcrumbJsonLd();

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoriesJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AppCategoriesPage categories={categories} />
    </>
  );
}

/**
 * Генерация метаданных для SEO
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Категории статей | ProfitableWeb',
    description:
      'Каталог всех категорий статей проекта ProfitableWeb. Найдите материалы по экономике внимания, ИИ-автоматизации, UI/UX дизайну, продуктовой разработке, редактуре и другим темам. Каждая категория содержит статьи по определённому направлению.',
    openGraph: {
      type: 'website',
      url: 'https://profitableweb.ru/categories',
      title: 'Категории статей | ProfitableWeb',
      description:
        'Каталог всех категорий статей проекта ProfitableWeb. Материалы по экономике внимания, ИИ-автоматизации, UI/UX дизайну и другим темам.',
    },
  };
}
