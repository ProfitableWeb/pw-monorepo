import { Metadata } from 'next';
import { MyCommentsPage } from '@/components/app-layout/app-my-comments-page';
import { getUserComments } from '@/lib/mock-api';

export const metadata: Metadata = {
  title: 'Мои комментарии',
  description: 'Все ваши комментарии на сайте',
  robots: 'noindex, nofollow',
};

/**
 * Страница "Мои комментарии"
 * Загружает данные на сервере и передаёт в клиентский компонент
 */
export default async function Page() {
  // Пока используем mock данные без авторизации
  // В будущем будем получать userId из сессии
  const comments = await getUserComments('user-1');

  return <MyCommentsPage initialComments={comments} />;
}
