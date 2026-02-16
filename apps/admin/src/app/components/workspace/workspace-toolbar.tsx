import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { LayoutGrid, Columns2, Rows2 } from 'lucide-react';
import { useResearchStore } from '@/app/store/research-store';
import { useWorkspaceLayoutStore } from '@/app/store/workspace-layout-store';
import { layoutTemplates } from '@/app/components/workspace/layout-templates';

export function WorkspaceToolbar() {
  const { currentResearchId } = useResearchStore();
  const { setLayout } = useWorkspaceLayoutStore();

  const applyTemplate = (name: string) => {
    if (!currentResearchId) return;
    const template = layoutTemplates.find(t => t.name === name);
    if (template) {
      setLayout(currentResearchId, template.create());
    }
  };

  return (
    <div className='flex items-center gap-1'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='h-7 gap-1.5 text-xs'>
            <LayoutGrid className='h-3.5 w-3.5' />
            Layout
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {layoutTemplates.map(t => (
            <DropdownMenuItem
              key={t.name}
              onClick={() => applyTemplate(t.name)}
            >
              {t.name === 'editor' && <Rows2 className='h-4 w-4' />}
              {t.name === 'editor-preview' && <Columns2 className='h-4 w-4' />}
              {t.name === 'research' && <LayoutGrid className='h-4 w-4' />}
              {t.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
