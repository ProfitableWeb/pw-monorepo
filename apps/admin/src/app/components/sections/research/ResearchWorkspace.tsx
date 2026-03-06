import { useEffect } from 'react';
import { ArrowLeft, FlaskConical, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useResearchStore } from '@/app/store/research-store';
import { useNavigationStore } from '@/app/store/navigation-store';
import { useHeaderStore } from '@/app/store/header-store';
import { useWorkspaceLayoutStore } from '@/app/store/workspace-layout-store';
import { ResearchSidebar } from './ResearchSidebar';
import { ResizableSidebar } from '@/app/components/workspace/resizable-sidebar';
import { CentralGrid } from '@/app/components/workspace/central-grid';
import { WorkspaceToolbar } from '@/app/components/workspace/workspace-toolbar';
import { getDefaultLayout } from '@/app/components/workspace/layout-templates';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';

export function ResearchWorkspace() {
  const { getCurrentResearch, currentResearchId } = useResearchStore();
  const { navigateTo } = useNavigationStore();
  const { setBreadcrumbs, reset } = useHeaderStore();
  const { getLayout, setLayout, loadFromLocalStorage } =
    useWorkspaceLayoutStore();
  const research = getCurrentResearch();

  // Установить хлебные крошки
  useEffect(() => {
    if (research) {
      setBreadcrumbs(breadcrumbPresets.researchWorkspace(research.title));
    }
    return () => reset();
  }, [research, setBreadcrumbs, reset]);

  // Инициализировать раскладку при монтировании
  useEffect(() => {
    if (!currentResearchId) return;
    const loaded = loadFromLocalStorage(currentResearchId);
    if (!loaded && !getLayout(currentResearchId)) {
      setLayout(currentResearchId, getDefaultLayout());
    }
  }, [currentResearchId]);

  if (!research) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='text-center'>
          <FlaskConical className='h-12 w-12 text-muted-foreground/40 mx-auto mb-4' />
          <p className='text-muted-foreground mb-4'>Исследование не выбрано</p>
          <Button variant='outline' onClick={() => navigateTo('research')}>
            <ArrowLeft className='h-4 w-4' />К списку исследований
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col bg-background'>
      {/* Панель инструментов */}
      <div className='h-9 border-b flex items-center px-3 gap-2 shrink-0 bg-background'>
        <WorkspaceToolbar />
      </div>

      {/* Трёхколоночная раскладка */}
      <div className='flex flex-1 min-h-0'>
        {/* Левый сайдбар — дерево файлов */}
        <ResizableSidebar position='left' minWidth={180} maxWidthPercent={30}>
          <ResearchSidebar researchId={research.id} />
        </ResizableSidebar>

        {/* Центр — разделённые панели */}
        <div className='flex-1 min-w-0'>
          <CentralGrid researchId={research.id} />
        </div>

        {/* Правый сайдбар — AI-ассистент */}
        <ResizableSidebar position='right' minWidth={200} maxWidthPercent={30}>
          <div className='flex items-center justify-center h-full p-4'>
            <div className='text-center text-muted-foreground'>
              <Sparkles className='h-8 w-8 mx-auto mb-3 opacity-20' />
              <p className='text-xs'>AI-чат будет в PW-039</p>
            </div>
          </div>
        </ResizableSidebar>
      </div>
    </div>
  );
}
