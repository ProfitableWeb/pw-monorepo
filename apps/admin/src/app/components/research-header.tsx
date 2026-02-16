import { useState, useRef, useEffect } from 'react';
import { cn } from '@/app/components/ui/utils';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useResearchStore } from '@/app/store/research-store';
import { useNavigationStore } from '@/app/store/navigation-store';
import type { ResearchStatus } from '@/app/types/research';

const statusOptions: { value: ResearchStatus; label: string; color: string }[] =
  [
    {
      value: 'idea',
      label: 'Идея',
      color:
        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      value: 'in_progress',
      label: 'В работе',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    },
    {
      value: 'review',
      label: 'На ревью',
      color:
        'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    },
    {
      value: 'completed',
      label: 'Завершено',
      color:
        'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    },
    {
      value: 'archived',
      label: 'Архив',
      color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    },
  ];

interface ResearchHeaderProps {
  toolbar?: React.ReactNode;
}

export function ResearchHeader({ toolbar }: ResearchHeaderProps) {
  const { getCurrentResearch, updateResearch } = useResearchStore();
  const { navigateTo } = useNavigationStore();
  const research = getCurrentResearch();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!research) return null;

  const currentStatus = statusOptions.find(s => s.value === research.status);

  const handleTitleClick = () => {
    setEditTitle(research.title);
    setIsEditing(true);
  };

  const handleTitleSave = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== research.title) {
      updateResearch(research.id, { title: trimmed });
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSave();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div className='h-12 border-b flex items-center px-3 gap-2 shrink-0 bg-background'>
      {/* Back button */}
      <Button
        variant='ghost'
        size='sm'
        className='h-7 w-7 p-0'
        onClick={() => navigateTo('research')}
      >
        <ArrowLeft className='h-4 w-4' />
      </Button>

      {/* Title */}
      {isEditing ? (
        <input
          ref={inputRef}
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={handleTitleSave}
          onKeyDown={handleTitleKeyDown}
          className='font-semibold text-sm bg-transparent border-b border-primary outline-none px-1 py-0.5 min-w-[200px]'
        />
      ) : (
        <button
          onClick={handleTitleClick}
          className='font-semibold text-sm hover:text-primary transition-colors truncate max-w-md'
          title='Нажмите для редактирования'
        >
          {research.title}
        </button>
      )}

      {/* Status dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
              currentStatus?.color
            )}
          >
            {currentStatus?.label}
            <ChevronDown className='h-3 w-3' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          {statusOptions.map(opt => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => updateResearch(research.id, { status: opt.value })}
            >
              <span className={cn('w-2 h-2 rounded-full mr-2', opt.color)} />
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Members */}
      <div className='flex -space-x-1.5 ml-2'>
        {research.members.slice(0, 3).map(m => (
          <div
            key={m.userId}
            className='h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center'
            title={`${m.user.name} (${m.role})`}
          >
            <span className='text-[10px] font-medium'>
              {m.user.name.charAt(0)}
            </span>
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div className='flex-1' />

      {/* Toolbar slot */}
      {toolbar}
    </div>
  );
}
