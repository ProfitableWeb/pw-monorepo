import { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface JsonLdPreviewProps {
  schemaType: string;
  title: string;
  description: string;
  slug: string;
  author: string;
  keywords: string[];
  imageUrl?: string;
  category: string;
}

export function JsonLdPreview({
  schemaType,
  title,
  description,
  slug,
  author,
  keywords,
  imageUrl,
  category,
}: JsonLdPreviewProps) {
  const [copied, setCopied] = useState(false);

  const jsonLd = useMemo(() => {
    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': schemaType || 'BlogPosting',
      headline: title || 'Заголовок статьи',
      description: description || undefined,
      url: `https://profitableweb.ru/${slug || ''}`,
      author: {
        '@type': 'Person',
        name: author || 'ProfitableWeb',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ProfitableWeb',
        url: 'https://profitableweb.ru',
      },
      datePublished: new Date().toISOString().split('T')[0],
      dateModified: new Date().toISOString().split('T')[0],
    };

    if (imageUrl) {
      data.image = {
        '@type': 'ImageObject',
        url: imageUrl.startsWith('/')
          ? `https://profitableweb.ru${imageUrl}`
          : imageUrl,
      };
    }

    if (keywords.length > 0) {
      data.keywords = keywords.join(', ');
    }

    if (category) {
      data.articleSection = category;
    }

    // Clean undefined values
    return JSON.stringify(
      Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== undefined)
      ),
      null,
      2
    );
  }, [
    schemaType,
    title,
    description,
    slug,
    author,
    keywords,
    imageUrl,
    category,
  ]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonLd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <div className='relative min-w-0'>
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-1 right-1 size-6 text-muted-foreground hover:text-foreground z-10'
        onClick={handleCopy}
        title='Копировать JSON-LD'
        type='button'
      >
        {copied ? <Check className='size-3' /> : <Copy className='size-3' />}
      </Button>
      <div className='rounded-lg border bg-muted/40 p-3 pr-8 overflow-hidden'>
        <pre className='text-[11px] leading-[1.5] font-mono text-muted-foreground whitespace-pre-wrap break-all'>
          <span className='opacity-50'>
            {'<script type="application/ld+json">'}
          </span>
          {'\n'}
          {jsonLd}
          {'\n'}
          <span className='opacity-50'>{'</script>'}</span>
        </pre>
      </div>
    </div>
  );
}
