import { Metadata } from 'next';
import { AuthorPage } from '@/components/app-layout/app-author-page';
import { getArticlesByAuthor } from '@/lib/mock-api';
import { AUTHOR_DATA } from '@/config/author';

export const metadata: Metadata = {
  title: `${AUTHOR_DATA.name} — ${AUTHOR_DATA.jobTitle}`,
  description: AUTHOR_DATA.description,
  openGraph: {
    title: `${AUTHOR_DATA.name} — ${AUTHOR_DATA.jobTitle}`,
    description: AUTHOR_DATA.description,
    images: [{ url: AUTHOR_DATA.avatar }],
    type: 'profile',
    firstName: AUTHOR_DATA.firstName,
    lastName: AUTHOR_DATA.lastName,
    username: 'nick_egorov',
  },
};

export default async function Page() {
  const articles = await getArticlesByAuthor(AUTHOR_DATA.name);

  return <AuthorPage articles={articles} />;
}
