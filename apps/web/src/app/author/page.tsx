import { Metadata } from 'next';
import { AuthorPage } from '@/components/app-layout/app-author-page';
import { getArticlesByAuthor, getAuthorProfile } from '@/lib/api-client';
import { AUTHOR_FALLBACK } from '@/config/author';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const author = await getAuthorProfile();
  const name = author?.name ?? AUTHOR_FALLBACK.name;
  const jobTitle = author?.jobTitle ?? AUTHOR_FALLBACK.jobTitle;
  const description = author?.bio ?? AUTHOR_FALLBACK.description;
  const avatar = author?.avatar ?? AUTHOR_FALLBACK.avatar;

  return {
    title: `${name} — ${jobTitle}`,
    description,
    openGraph: {
      title: `${name} — ${jobTitle}`,
      description,
      images: [{ url: avatar }],
      type: 'profile',
    },
  };
}

export default async function Page() {
  const author = await getAuthorProfile();
  const authorName = author?.name ?? AUTHOR_FALLBACK.name;
  const articles = await getArticlesByAuthor(authorName);

  return <AuthorPage author={author} articles={articles} />;
}
