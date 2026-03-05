import {
  FileText,
  Link2,
  ImageIcon,
  Clock,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { mockRevisions, mockResearchMaterials } from '@/app/mock/article-mock';

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function WorkbenchSidebar() {
  return (
    <div className='p-6 space-y-8 max-w-4xl mx-auto'>
      {/* Research Materials */}
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

      {/* Revision History */}
      <section>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-sm font-semibold'>История ревизий</h3>
          <Badge variant='secondary' className='text-xs'>
            {mockRevisions.length}
          </Badge>
        </div>
        <div className='relative'>
          {/* Timeline line */}
          <div className='absolute left-[15px] top-2 bottom-2 w-px bg-border' />
          <div className='space-y-1'>
            {mockRevisions.map((rev, index) => (
              <div
                key={rev.id}
                className='flex items-start gap-3 p-2 pl-0 rounded-md hover:bg-muted/50 transition-colors group relative'
              >
                <div className='relative z-10 p-1 rounded-full bg-background border shrink-0'>
                  <Clock className='h-3.5 w-3.5 text-muted-foreground' />
                </div>
                <div className='flex-1 min-w-0 pt-0.5'>
                  <p className='text-sm'>{rev.summary}</p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    {rev.author} · {formatDate(rev.date)}
                  </p>
                </div>
                {index > 0 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-7 gap-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0'
                    title='Восстановить'
                  >
                    <RotateCcw className='h-3 w-3' />
                    Восстановить
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
