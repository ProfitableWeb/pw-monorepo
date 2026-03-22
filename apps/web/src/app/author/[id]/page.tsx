import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AuthorPage } from '@/components/app-layout/app-author-page';
import { getArticlesByAuthor, getAuthorById } from '@/lib/api-client';
import { AUTHOR_FALLBACK } from '@/config/author';

interface AuthorIdPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AuthorIdPageProps): Promise<Metadata> {
  const { id } = await params;
  const author = await getAuthorById(id);
  if (!author) {
    return { title: 'Автор не найден' };
  }

  const name = author.name;
  const jobTitle = author.jobTitle ?? AUTHOR_FALLBACK.jobTitle;
  const description = author.bio ?? AUTHOR_FALLBACK.description;
  const avatar = author.avatar ?? AUTHOR_FALLBACK.avatar;

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

export default async function Page({ params }: AuthorIdPageProps) {
  const { id } = await params;
  const author = await getAuthorById(id);
  if (!author) notFound();

  const articles = await getArticlesByAuthor(author.name);

  return <AuthorPage author={author} articles={articles} />;
}
