import {
  FileText,
  Link2,
  ImageIcon,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { mockResearchMaterials } from '@/app/mock/article-mock';

const MATERIAL_ICONS = {
  note: FileText,
  source: Link2,
  media: ImageIcon,
} as const;

const MATERIAL_LABELS = {
  note: 'Заметка',
  source: 'Источник',
  media: 'Медиа',
} as const;

export function ResearchTab() {
  return (
    <div className='p-6 space-y-6 max-w-4xl mx-auto'>
      {/* Link to workspace */}
      <Button
        variant='outline'
        className='gap-2 w-full justify-center'
        onClick={() => {
          // TODO: navigate to research workspace
        }}
      >
        <ArrowUpRight className='size-4' />
        Перейти к исследованию
      </Button>

      {/* Materials grid */}
      <section>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-sm font-semibold'>Материалы исследования</h3>
          <Badge variant='secondary' className='text-xs'>
            {mockResearchMaterials.length}
          </Badge>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {mockResearchMaterials.map(mat => {
            const Icon = MATERIAL_ICONS[mat.type];
            return (
              <button
                key={mat.id}
                className='flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left group'
              >
                <div className='p-2 rounded-md bg-muted shrink-0'>
                  <Icon className='h-4 w-4 text-muted-foreground' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium line-clamp-2'>
                    {mat.title}
                  </p>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='text-xs text-muted-foreground'>
                      {MATERIAL_LABELS[mat.type]}
                    </span>
                    {mat.url && (
                      <ExternalLink className='h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
