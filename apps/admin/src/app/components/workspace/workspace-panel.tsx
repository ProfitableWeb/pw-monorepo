import { FlaskConical } from 'lucide-react';
import type { LayoutPanel } from '@/app/types/workspace-layout';
import { TabBar } from '@/app/components/workspace/tab-bar';
import { panelRegistry } from '@/app/components/workspace/panel-registry';

interface WorkspacePanelProps {
  panel: LayoutPanel;
  researchId: string;
}

export function WorkspacePanel({ panel, researchId }: WorkspacePanelProps) {
  const activeTab = panel.tabs.find(t => t.id === panel.activeTabId);

  return (
    <div className='flex flex-col h-full'>
      {/* Панель вкладок */}
      <TabBar
        tabs={panel.tabs}
        activeTabId={panel.activeTabId}
        panelId={panel.id}
        researchId={researchId}
      />

      {/* Контент */}
      <div className='flex-1 min-h-0 overflow-auto'>
        {activeTab ? (
          <PanelContent
            itemType={activeTab.itemType}
            itemId={activeTab.itemId}
          />
        ) : (
          <EmptyPanel />
        )}
      </div>
    </div>
  );
}

function PanelContent({
  itemType,
  itemId,
}: {
  itemType: string;
  itemId: string;
}) {
  const Component = panelRegistry[itemType as keyof typeof panelRegistry];
  if (!Component) {
    return (
      <div className='flex items-center justify-center h-full text-muted-foreground text-sm'>
        Неизвестный тип: {itemType}
      </div>
    );
  }
  return <Component itemId={itemId} />;
}

function EmptyPanel() {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='text-center text-muted-foreground'>
        <FlaskConical className='h-10 w-10 mx-auto mb-3 opacity-15' />
        <p className='text-sm font-medium mb-1'>Панель пуста</p>
        <p className='text-xs'>
          Выберите файл в сайдбаре или используйте поиск
        </p>
      </div>
    </div>
  );
}
