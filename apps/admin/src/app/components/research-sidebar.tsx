import { useState, useCallback } from 'react';
import { cn } from '@/app/components/ui/utils';
import {
  ChevronRight,
  ChevronDown,
  StickyNote,
  Link2,
  FileEdit,
  ImageIcon,
  BookOpen,
} from 'lucide-react';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useResearchStore } from '@/app/store/research-store';
import { useWorkspaceLayoutStore } from '@/app/store/workspace-layout-store';
import type { ItemType } from '@/app/types/workspace-layout';

interface ResearchSidebarProps {
  researchId: string;
}

export function ResearchSidebar({ researchId }: ResearchSidebarProps) {
  const {
    getResearchNotes,
    getResearchSources,
    getResearchDrafts,
    getResearchMedia,
    getResearchPublications,
  } = useResearchStore();

  const notes = getResearchNotes(researchId);
  const sources = getResearchSources(researchId);
  const drafts = getResearchDrafts(researchId);
  const media = getResearchMedia(researchId);
  const publications = getResearchPublications(researchId);

  return (
    <ScrollArea className='h-full'>
      <div className='py-1'>
        {/* Materials section */}
        <SectionHeader title='Материалы' />

        <TreeSection
          title='Заметки'
          icon={StickyNote}
          items={notes.map(n => ({
            id: n.id,
            title: n.title,
            itemType: 'note' as ItemType,
          }))}
          researchId={researchId}
        />

        <TreeSection
          title='Источники'
          icon={Link2}
          items={sources.map(s => ({
            id: s.id,
            title: s.title,
            itemType: 'source' as ItemType,
          }))}
          researchId={researchId}
        />

        <TreeSection
          title='Черновики'
          icon={FileEdit}
          items={drafts.map(d => ({
            id: d.id,
            title: d.title,
            itemType: 'draft' as ItemType,
          }))}
          researchId={researchId}
        />

        <TreeSection
          title='Медиа'
          icon={ImageIcon}
          items={media.map(m => ({
            id: m.id,
            title: m.fileName,
            itemType: 'media' as ItemType,
          }))}
          researchId={researchId}
        />

        {/* Publications section */}
        <div className='mt-3'>
          <SectionHeader title='Публикации' />
          {publications.length === 0 ? (
            <p className='px-3 py-1 text-[11px] text-muted-foreground/50'>
              Нет публикаций
            </p>
          ) : (
            publications.map(pub => (
              <div
                key={pub.id}
                className='flex items-center gap-2 px-3 py-1 text-[11px] text-muted-foreground'
              >
                <BookOpen className='h-3 w-3 shrink-0' />
                <span className='truncate'>{pub.title}</span>
                <span
                  className={cn(
                    'text-[10px] px-1 rounded shrink-0',
                    pub.status === 'published'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {pub.status === 'published' ? 'опубл.' : 'драфт'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </ScrollArea>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className='px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50'>
      {title}
    </div>
  );
}

interface TreeItem {
  id: string;
  title: string;
  itemType: ItemType;
}

function TreeSection({
  title,
  icon: Icon,
  items,
  researchId,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: TreeItem[];
  researchId: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const { openTab, getLayout } = useWorkspaceLayoutStore();

  const handleItemClick = useCallback(
    (item: TreeItem, pin: boolean) => {
      const layout = getLayout(researchId);
      if (!layout) return;

      // Find the first panel in the layout
      const panelId = findFirstPanelId(layout);
      if (!panelId) return;

      openTab(researchId, panelId, {
        id: `tab-${item.itemType}-${item.id}`,
        itemType: item.itemType,
        itemId: item.id,
        title: item.title,
        isPinned: pin,
      });
    },
    [researchId, openTab, getLayout]
  );

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className='flex items-center gap-1 w-full px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors'
      >
        {expanded ? (
          <ChevronDown className='h-3 w-3 shrink-0' />
        ) : (
          <ChevronRight className='h-3 w-3 shrink-0' />
        )}
        <Icon className='h-3 w-3 shrink-0' />
        <span>{title}</span>
        <span className='ml-auto text-[10px] text-muted-foreground/50'>
          {items.length}
        </span>
      </button>

      {expanded && (
        <div>
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item, false)}
              onDoubleClick={() => handleItemClick(item, true)}
              className='flex items-center gap-2 w-full pl-7 pr-3 py-1 text-[11px] text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors truncate'
            >
              {item.title}
            </button>
          ))}
          {items.length === 0 && (
            <p className='pl-7 pr-3 py-1 text-[10px] text-muted-foreground/40'>
              Пусто
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Utility: find first panel ID in recursive layout
function findFirstPanelId(
  node: import('@/app/types/workspace-layout').LayoutNode
): string | null {
  if (node.type === 'panel') return node.id;
  return findFirstPanelId(node.first);
}
