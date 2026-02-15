import { AppHomePage } from '@/components/app-layout/app-home-page';
import { getAllArticles } from '@/lib/api-client';

export const dynamic = 'force-dynamic';

/**
 * Главная страница с masonry-сеткой статей
 * Server Component для SEO-оптимизации
 *
 * Данные загружаются на сервере и передаются в Client Component
 * для интерактивной отрисовки с анимациями
 */
export default async function HomePage() {
  const articles = await getAllArticles();

  return <AppHomePage articles={articles} />;
}
