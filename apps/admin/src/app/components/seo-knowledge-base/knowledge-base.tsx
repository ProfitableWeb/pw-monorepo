import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { KBTree } from './kb-tree';
import { KBArticleEditor } from './kb-article-editor';
import { mockKBTree, findKBArticle, welcomeArticle } from './kb-types';

interface KnowledgeBaseProps {
  initialArticleId?: string;
}

export function KnowledgeBase({ initialArticleId }: KnowledgeBaseProps) {
  const [activeArticleId, setActiveArticleId] = useState<string>(
    initialArticleId || ''
  );
  const [searchQuery, setSearchQuery] = useState('');

  // React to external navigation (from InfoHint)
  useEffect(() => {
    if (initialArticleId) {
      setActiveArticleId(initialArticleId);
    }
  }, [initialArticleId]);

  const activeArticle = activeArticleId
    ? findKBArticle(activeArticleId)
    : welcomeArticle;

  return (
    <div className='flex h-full'>
      {/* Tree sidebar */}
      <div className='w-60 border-r flex flex-col shrink-0'>
        <div className='p-3 border-b shrink-0'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground' />
            <Input
              placeholder='Найти инструкцию...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-8 h-8 text-[13px]'
            />
          </div>
        </div>

        <ScrollArea className='flex-1 min-h-0'>
          <KBTree
            categories={mockKBTree}
            activeArticleId={activeArticleId}
            onSelectArticle={setActiveArticleId}
          />
        </ScrollArea>

        <div className='p-3 border-t shrink-0'>
          <Button variant='outline' size='sm' className='w-full text-xs'>
            <Plus className='size-3.5 mr-1.5' />
            Новая инструкция
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className='flex-1 min-w-0'>
        <KBArticleEditor article={activeArticle} />
      </div>
    </div>
  );
}
