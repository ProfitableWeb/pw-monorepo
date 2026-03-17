import { cn } from '@/app/components/ui/utils';
import { twToHex } from '@/app/components/common/colors';

import type { Tag } from '../tags.types';
import { getTagSize, getTagOpacity } from '../tags.utils';

interface TagCloudViewProps {
  tags: Tag[];
  maxCount: number;
  selectedTagId: string | null;
  onSelect: (tag: Tag) => void;
}

export function TagCloudView({
  tags,
  maxCount,
  selectedTagId,
  onSelect,
}: TagCloudViewProps) {
  return (
    <div className='p-8 border rounded-lg bg-muted/30 min-h-[400px] flex flex-wrap items-center justify-center gap-4 content-center'>
      {tags.map(tag => (
        <button
          key={tag.id}
          onClick={() => onSelect(tag)}
          className={cn(
            'font-semibold transition-all duration-300 hover:scale-110 cursor-pointer',
            getTagSize(tag.articlesCount, maxCount),
            getTagOpacity(tag.articlesCount, maxCount),
            selectedTagId === tag.id && 'scale-125 text-primary'
          )}
          style={{
            color: selectedTagId === tag.id ? undefined : twToHex(tag.color),
            filter: 'saturate(0.8)',
          }}
        >
          #{tag.name}
        </button>
      ))}
    </div>
  );
}
