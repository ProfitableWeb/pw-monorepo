import { Metadata } from 'next';
import { MyCommentsPage } from '@/components/app-layout/app-my-comments-page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Мои комментарии',
  description: 'Все ваши комментарии на сайте',
  robots: 'noindex, nofollow',
};

/**
 * Страница «Мои комментарии».
 *
 * PW-074 | Данные загружаются на клиенте: `/users/me/comments` требует
 * авторизации, а httpOnly-куки сессии в серверный fetch не попадают.
 * Раньше здесь был серверный запрос с захардкоженным `user-1`.
 */
export default function Page() {
  return <MyCommentsPage />;
}
