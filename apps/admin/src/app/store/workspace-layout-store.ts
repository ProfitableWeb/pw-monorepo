import { create } from 'zustand';
import type {
  LayoutNode,
  LayoutPanel,
  PanelTab,
} from '@/app/types/workspace-layout';

const STORAGE_PREFIX = 'workspace-layout-';

// === Helpers для рекурсивного обхода LayoutNode ===

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function findPanelById(node: LayoutNode, panelId: string): LayoutPanel | null {
  if (node.type === 'panel') {
    return node.id === panelId ? node : null;
  }
  return (
    findPanelById(node.first, panelId) || findPanelById(node.second, panelId)
  );
}

function findFirstPanel(node: LayoutNode): LayoutPanel | null {
  if (node.type === 'panel') return node;
  return findFirstPanel(node.first);
}

function updatePanelInTree(
  node: LayoutNode,
  panelId: string,
  updater: (panel: LayoutPanel) => LayoutPanel
): LayoutNode {
  if (node.type === 'panel') {
    return node.id === panelId ? updater(node) : node;
  }
  return {
    ...node,
    first: updatePanelInTree(node.first, panelId, updater),
    second: updatePanelInTree(node.second, panelId, updater),
  };
}

function updateSplitInTree(
  node: LayoutNode,
  splitId: string,
  ratio: number
): LayoutNode {
  if (node.type === 'split') {
    if (node.id === splitId) {
      return { ...node, ratio };
    }
    return {
      ...node,
      first: updateSplitInTree(node.first, splitId, ratio),
      second: updateSplitInTree(node.second, splitId, ratio),
    };
  }
  return node;
}

// === Store ===

interface WorkspaceLayoutState {
  // Sidebars
  leftSidebarWidth: number;
  leftSidebarCollapsed: boolean;
  rightSidebarWidth: number;
  rightSidebarCollapsed: boolean;

  // Central grid layouts per research
  layouts: Record<string, LayoutNode>;

  // Sidebar actions
  setLeftSidebarWidth: (width: number) => void;
  toggleLeftSidebar: () => void;
  setRightSidebarWidth: (width: number) => void;
  toggleRightSidebar: () => void;

  // Layout actions
  getLayout: (researchId: string) => LayoutNode | undefined;
  setLayout: (researchId: string, layout: LayoutNode) => void;
  updateSplitRatio: (
    researchId: string,
    splitId: string,
    ratio: number
  ) => void;

  // Tab management
  openTab: (researchId: string, panelId: string, tab: PanelTab) => void;
  closeTab: (researchId: string, panelId: string, tabId: string) => void;
  setActiveTab: (researchId: string, panelId: string, tabId: string) => void;
  pinTab: (researchId: string, panelId: string, tabId: string) => void;
  setTabDirty: (
    researchId: string,
    panelId: string,
    tabId: string,
    dirty: boolean
  ) => void;

  // Persistence
  saveToLocalStorage: (researchId: string) => void;
  loadFromLocalStorage: (researchId: string) => boolean;
}

export const useWorkspaceLayoutStore = create<WorkspaceLayoutState>(
  (set, get) => ({
    leftSidebarWidth: 280,
    leftSidebarCollapsed: false,
    rightSidebarWidth: 320,
    rightSidebarCollapsed: false,
    layouts: {},

    setLeftSidebarWidth: width => set({ leftSidebarWidth: width }),
    toggleLeftSidebar: () =>
      set(s => ({ leftSidebarCollapsed: !s.leftSidebarCollapsed })),
    setRightSidebarWidth: width => set({ rightSidebarWidth: width }),
    toggleRightSidebar: () =>
      set(s => ({ rightSidebarCollapsed: !s.rightSidebarCollapsed })),

    getLayout: researchId => get().layouts[researchId],

    setLayout: (researchId, layout) => {
      set(s => ({ layouts: { ...s.layouts, [researchId]: layout } }));
      get().saveToLocalStorage(researchId);
    },

    updateSplitRatio: (researchId, splitId, ratio) => {
      const layout = get().layouts[researchId];
      if (!layout) return;
      const updated = updateSplitInTree(deepClone(layout), splitId, ratio);
      set(s => ({ layouts: { ...s.layouts, [researchId]: updated } }));
      get().saveToLocalStorage(researchId);
    },

    openTab: (researchId, panelId, tab) => {
      const layout = get().layouts[researchId];
      if (!layout) return;

      const cloned = deepClone(layout);
      const panel = findPanelById(cloned, panelId) || findFirstPanel(cloned);
      if (!panel) return;

      // Check if tab already open
      const existingTab = panel.tabs.find(
        t => t.itemId === tab.itemId && t.itemType === tab.itemType
      );
      if (existingTab) {
        panel.activeTabId = existingTab.id;
        set(s => ({ layouts: { ...s.layouts, [researchId]: cloned } }));
        return;
      }

      if (!tab.isPinned) {
        // Replace existing preview tab (first unpinned)
        const previewIndex = panel.tabs.findIndex(t => !t.isPinned);
        if (previewIndex !== -1) {
          panel.tabs[previewIndex] = tab;
        } else {
          panel.tabs.push(tab);
        }
      } else {
        panel.tabs.push(tab);
      }

      panel.activeTabId = tab.id;
      set(s => ({ layouts: { ...s.layouts, [researchId]: cloned } }));
      get().saveToLocalStorage(researchId);
    },

    closeTab: (researchId, panelId, tabId) => {
      const layout = get().layouts[researchId];
      if (!layout) return;

      const updated = updatePanelInTree(deepClone(layout), panelId, panel => {
        const newTabs = panel.tabs.filter(t => t.id !== tabId);
        const wasActive = panel.activeTabId === tabId;
        return {
          ...panel,
          tabs: newTabs,
          activeTabId: wasActive
            ? (newTabs[newTabs.length - 1]?.id ?? null)
            : panel.activeTabId,
        };
      });

      set(s => ({ layouts: { ...s.layouts, [researchId]: updated } }));
      get().saveToLocalStorage(researchId);
    },

    setActiveTab: (researchId, panelId, tabId) => {
      const layout = get().layouts[researchId];
      if (!layout) return;

      const updated = updatePanelInTree(deepClone(layout), panelId, panel => ({
        ...panel,
        activeTabId: tabId,
      }));

      set(s => ({ layouts: { ...s.layouts, [researchId]: updated } }));
    },

    pinTab: (researchId, panelId, tabId) => {
      const layout = get().layouts[researchId];
      if (!layout) return;

      const updated = updatePanelInTree(deepClone(layout), panelId, panel => ({
        ...panel,
        tabs: panel.tabs.map(t =>
          t.id === tabId ? { ...t, isPinned: true } : t
        ),
      }));

      set(s => ({ layouts: { ...s.layouts, [researchId]: updated } }));
      get().saveToLocalStorage(researchId);
    },

    setTabDirty: (researchId, panelId, tabId, dirty) => {
      const layout = get().layouts[researchId];
      if (!layout) return;

      const updated = updatePanelInTree(deepClone(layout), panelId, panel => ({
        ...panel,
        tabs: panel.tabs.map(t =>
          t.id === tabId ? { ...t, isDirty: dirty } : t
        ),
      }));

      set(s => ({ layouts: { ...s.layouts, [researchId]: updated } }));
    },

    saveToLocalStorage: researchId => {
      const layout = get().layouts[researchId];
      if (layout) {
        try {
          localStorage.setItem(
            `${STORAGE_PREFIX}${researchId}`,
            JSON.stringify(layout)
          );
        } catch {
          // Storage full or unavailable
        }
      }
    },

    loadFromLocalStorage: researchId => {
      try {
        const saved = localStorage.getItem(`${STORAGE_PREFIX}${researchId}`);
        if (saved) {
          const layout = JSON.parse(saved) as LayoutNode;
          set(s => ({ layouts: { ...s.layouts, [researchId]: layout } }));
          return true;
        }
      } catch {
        // Invalid JSON
      }
      return false;
    },
  })
);
