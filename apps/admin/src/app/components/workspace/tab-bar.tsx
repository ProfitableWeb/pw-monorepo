import { useCallback } from 'react';
import { cn } from '@/app/components/ui/utils';
import {
  X,
  StickyNote,
  FileEdit,
  Link2,
  ImageIcon,
  Sparkles,
} from 'lucide-react';
import type { PanelTab, ItemType } from '@/app/types/workspace-layout';
import { useWorkspaceLayoutStore } from '@/app/store/workspace-layout-store';

const typeIcons: Record<
  ItemType,
  React.ComponentType<{ className?: string }>
> = {
  note: StickyNote,
  draft: FileEdit,
  source: Link2,
  media: ImageIcon,
  'ai-chat': Sparkles,
};

interface TabBarProps {
  tabs: PanelTab[];
  activeTabId: string | null;
  panelId: string;
  researchId: string;
}

export function TabBar({
  tabs,
  activeTabId,
  panelId,
  researchId,
}: TabBarProps) {
  const { setActiveTab, closeTab, pinTab } = useWorkspaceLayoutStore();

  const handleClick = useCallback(
    (tabId: string) => {
      setActiveTab(researchId, panelId, tabId);
    },
    [researchId, panelId, setActiveTab]
  );

  const handleDoubleClick = useCallback(
    (tabId: string) => {
      pinTab(researchId, panelId, tabId);
    },
    [researchId, panelId, pinTab]
  );

  const handleClose = useCallback(
    (e: React.MouseEvent, tabId: string) => {
      e.stopPropagation();
      closeTab(researchId, panelId, tabId);
    },
    [researchId, panelId, closeTab]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, tabId: string) => {
      // Middle-click to close
      if (e.button === 1) {
        e.preventDefault();
        closeTab(researchId, panelId, tabId);
      }
    },
    [researchId, panelId, closeTab]
  );

  if (tabs.length === 0) return null;

  return (
    <div className='flex items-center h-8 border-b bg-muted/30 overflow-x-auto'>
      {tabs.map(tab => {
        const Icon = typeIcons[tab.itemType];
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            onClick={() => handleClick(tab.id)}
            onDoubleClick={() => handleDoubleClick(tab.id)}
            onMouseDown={e => handleMouseDown(e, tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 h-full text-xs shrink-0 border-r transition-colors group',
              'hover:bg-accent/50',
              isActive
                ? 'bg-background text-foreground border-b-2 border-b-primary'
                : 'text-muted-foreground',
              !tab.isPinned && 'italic' // preview tabs are italic
            )}
          >
            <Icon className='h-3 w-3 shrink-0' />
            <span className='truncate max-w-[120px]'>{tab.title}</span>
            {tab.isDirty && (
              <span className='text-primary font-bold ml-0.5'>●</span>
            )}
            <span
              onClick={e => handleClose(e, tab.id)}
              className={cn(
                'h-4 w-4 rounded flex items-center justify-center shrink-0 ml-0.5',
                'opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity',
                isActive && 'opacity-60'
              )}
            >
              <X className='h-2.5 w-2.5' />
            </span>
          </button>
        );
      })}
    </div>
  );
}
