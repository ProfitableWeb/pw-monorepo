import { Metadata } from 'next';
import { ArticlePageOneColumn } from '@/components/app-layout/app-article-page-one-column';

/**
 * Тестовая страница для одноколоночного лейаута статьи
 *
 * Демонстрирует использование одноколоночного лейаута с блоками 100% ширины.
 * Доступна по адресу /one-column-article
 */
export default function OneColumnArticlePage() {
  return <ArticlePageOneColumn />;
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
