import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Plus,
  Search,
  StickyNote,
  Link2,
  FileEdit,
  ImageIcon,
  BookOpen,
  FlaskConical,
} from 'lucide-react';
import { useResearchStore } from '@/app/store/research-store';
import { useNavigationStore } from '@/app/store/navigation-store';
import { useHeaderStore } from '@/app/store/header-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';
import type { ResearchStatus } from '@/app/types/research';

const statusConfig: Record<
  ResearchStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
  }
> = {
  idea: { label: 'Идея', variant: 'outline' },
  in_progress: { label: 'В работе', variant: 'default' },
  review: { label: 'На ревью', variant: 'secondary' },
  completed: { label: 'Завершено', variant: 'secondary' },
  archived: { label: 'Архив', variant: 'outline' },
};

const filterOptions: { value: ResearchStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'idea', label: 'Идеи' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'review', label: 'На ревью' },
  { value: 'completed', label: 'Завершено' },
  { value: 'archived', label: 'Архив' },
];

export function ResearchListPage() {
  const {
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    setCurrentResearch,
    createResearch,
    getFilteredResearches,
    getResearchCounts,
  } = useResearchStore();
  const { navigateTo } = useNavigationStore();
  const { setBreadcrumbs, reset } = useHeaderStore();
  const researches = getFilteredResearches();

  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.research());
    return () => reset();
  }, [setBreadcrumbs, reset]);

  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleOpenResearch = (id: string) => {
    setCurrentResearch(id);
    navigateTo('research-workspace');
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const research = createResearch(newTitle.trim(), newDescription.trim());
    setCreateOpen(false);
    setNewTitle('');
    setNewDescription('');
    handleOpenResearch(research.id);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Исследования</h1>
          <p className='text-muted-foreground mt-1'>
            Рабочие пространства для сбора материалов и создания публикаций
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className='h-4 w-4' />
          Новое исследование
        </Button>
      </div>

      {/* Filters */}
      <div className='flex items-center gap-4'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Поиск исследований...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-9'
          />
        </div>
        <div className='flex items-center gap-1'>
          {filterOptions.map(opt => (
            <Button
              key={opt.value}
              variant={statusFilter === opt.value ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      {researches.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 text-center'>
          <FlaskConical className='h-12 w-12 text-muted-foreground/40 mb-4' />
          <p className='text-muted-foreground'>Исследований не найдено</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          {researches.map(research => {
            const counts = getResearchCounts(research.id);
            const cfg = statusConfig[research.status];

            return (
              <button
                key={research.id}
                onClick={() => handleOpenResearch(research.id)}
                className='text-left rounded-xl border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all group'
              >
                <div className='flex items-start justify-between mb-3'>
                  <h3 className='font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors'>
                    {research.title}
                  </h3>
                  <Badge
                    variant={cfg.variant}
                    className='ml-2 shrink-0 text-xs'
                  >
                    {cfg.label}
                  </Badge>
                </div>

                <p className='text-xs text-muted-foreground line-clamp-2 mb-4'>
                  {research.description}
                </p>

                {/* Counters */}
                <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                  <CounterBadge
                    icon={StickyNote}
                    count={counts.notes}
                    label='заметок'
                  />
                  <CounterBadge
                    icon={Link2}
                    count={counts.sources}
                    label='источников'
                  />
                  <CounterBadge
                    icon={FileEdit}
                    count={counts.drafts}
                    label='черновиков'
                  />
                  <CounterBadge
                    icon={ImageIcon}
                    count={counts.media}
                    label='медиа'
                  />
                  <CounterBadge
                    icon={BookOpen}
                    count={counts.publications}
                    label='публикаций'
                  />
                </div>

                {/* Members + date */}
                <div className='flex items-center justify-between mt-4 pt-3 border-t'>
                  <div className='flex -space-x-2'>
                    {research.members.slice(0, 3).map(m => (
                      <div
                        key={m.userId}
                        className='h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center'
                        title={m.user.name}
                      >
                        <span className='text-[10px] font-medium'>
                          {m.user.name.charAt(0)}
                        </span>
                      </div>
                    ))}
                    {research.members.length > 3 && (
                      <div className='h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center'>
                        <span className='text-[10px] font-medium'>
                          +{research.members.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className='text-xs text-muted-foreground'>
                    {formatDate(research.updatedAt)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новое исследование</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            <div>
              <label className='text-sm font-medium mb-1.5 block'>
                Название
              </label>
              <Input
                placeholder='Например: Влияние AI на рынок труда'
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </div>
            <div>
              <label className='text-sm font-medium mb-1.5 block'>
                Описание
              </label>
              <Textarea
                placeholder='Краткое описание цели и охвата исследования...'
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setCreateOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim()}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CounterBadge({
  icon: Icon,
  count,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  label: string;
}) {
  if (count === 0) return null;
  return (
    <span className='flex items-center gap-1' title={`${count} ${label}`}>
      <Icon className='h-3 w-3' />
      {count}
    </span>
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'сегодня';
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
