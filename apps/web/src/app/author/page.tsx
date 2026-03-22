import { redirect } from 'next/navigation';
import { getAuthorProfile } from '@/lib/api-client';

export const dynamic = 'force-dynamic';

/**
 * /author → редирект на /author/{id} основного автора
 */
export default async function Page() {
  const author = await getAuthorProfile();
  if (!author) redirect('/');
  redirect(`/author/${author.id}`);
}
