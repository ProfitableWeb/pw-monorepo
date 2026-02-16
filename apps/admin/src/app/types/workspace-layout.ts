export type SplitDirection = 'horizontal' | 'vertical';
export type ItemType = 'note' | 'draft' | 'source' | 'media' | 'ai-chat';

export interface PanelTab {
  id: string;
  itemType: ItemType;
  itemId: string;
  title: string;
  isPinned: boolean; // false = preview (italic, replaced on next click)
  isDirty?: boolean; // unsaved changes (● indicator)
}

export interface LayoutPanel {
  type: 'panel';
  id: string;
  tabs: PanelTab[];
  activeTabId: string | null;
}

export interface LayoutSplit {
  type: 'split';
  id: string;
  direction: SplitDirection;
  ratio: number; // 0..1, position of divider
  first: LayoutNode;
  second: LayoutNode;
}

export type LayoutNode = LayoutSplit | LayoutPanel;
