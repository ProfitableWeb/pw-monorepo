import { useState } from 'react';
import { ChevronRight, FileText, FolderOpen, Folder } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import type { KBCategory } from './kb-types';

interface KBTreeProps {
  categories: KBCategory[];
  activeArticleId?: string;
  onSelectArticle: (articleId: string) => void;
}

function CategoryNode({
  category,
  activeArticleId,
  onSelectArticle,
  depth = 0,
}: {
  category: KBCategory;
  activeArticleId?: string;
  onSelectArticle: (articleId: string) => void;
  depth?: number;
}) {
  const hasActiveChild = category.articles.some(a => a.id === activeArticleId);
  const [expanded, setExpanded] = useState(hasActiveChild || true);

  const FolderIcon = expanded ? FolderOpen : Folder;

  return (
    <div>
      {/* Category header */}
      <button
        type='button'
        onClick={() => setExpanded(v => !v)}
        className={cn(
          'w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors',
          'text-foreground/80 hover:bg-accent/50'
        )}
        style={{ paddingLeft: depth * 16 + 8 }}
      >
        <ChevronRight
          className={cn(
            'size-3.5 shrink-0 transition-transform text-muted-foreground/50',
            expanded && 'rotate-90'
          )}
        />
        <FolderIcon className='size-3.5 shrink-0 text-muted-foreground/60' />
        <span className='truncate'>{category.label}</span>
        <span className='ml-auto text-[10px] text-muted-foreground/40'>
          {category.articles.length}
        </span>
      </button>

      {/* Articles */}
      {expanded && (
        <div>
          {category.articles.map(article => (
            <button
              key={article.id}
              type='button'
              onClick={() => onSelectArticle(article.id)}
              className={cn(
                'w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[13px] transition-colors',
                activeArticleId === article.id
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
              )}
              style={{ paddingLeft: (depth + 1) * 16 + 8 }}
            >
              <FileText className='size-3.5 shrink-0 opacity-50' />
              <span className='truncate'>{article.title}</span>
            </button>
          ))}

          {/* Nested categories */}
          {category.children.map(child => (
            <CategoryNode
              key={child.id}
              category={child}
              activeArticleId={activeArticleId}
              onSelectArticle={onSelectArticle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function KBTree({
  categories,
  activeArticleId,
  onSelectArticle,
}: KBTreeProps) {
  return (
    <nav className='space-y-0.5 p-2'>
      {categories.map(category => (
        <CategoryNode
          key={category.id}
          category={category}
          activeArticleId={activeArticleId}
          onSelectArticle={onSelectArticle}
        />
      ))}
    </nav>
  );
}
