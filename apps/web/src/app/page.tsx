import { AppHomePage } from '@/components/app-layout/app-home-page';
import { mockArticles } from '@/components/common/masonry/data';

/**
 * Главная страница с masonry-сеткой статей
 * Server Component для SEO-оптимизации
 *
 * Данные загружаются на сервере и передаются в Client Component
 * для интерактивной отрисовки с анимациями
 */
export default function HomePage() {
  // В будущем здесь будет вызов API: const articles = await getArticles();
  const articles = mockArticles;

  return <AppHomePage articles={articles} />;
}
