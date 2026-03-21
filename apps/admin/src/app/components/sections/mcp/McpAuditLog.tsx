/**
 * PW-061-A | Лог MCP-действий.
 * Полноэкранная таблица с закреплённой шапкой, поиском, фильтрацией.
 */
import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Search,
  X,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { cn } from '@/app/components/ui/utils';
import type { McpAuditEntry } from './mcp.types';
import { MOCK_AUDIT_LOG, MOCK_API_KEYS } from './mcp.mock-data';

// --- Helpers ---

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${day}, ${time}`;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

const TOOL_CATEGORIES: Record<string, string> = {
  list_articles: 'Статьи',
  get_article: 'Статьи',
  create_article: 'Статьи',
  update_article: 'Статьи',
  publish_article: 'Статьи',
  delete_article: 'Статьи',
  search_articles: 'Статьи',
  schedule_article: 'Статьи',
  get_article_stats: 'Статьи',
  list_categories: 'Категории',
  create_category: 'Категории',
  update_category: 'Категории',
  delete_category: 'Категории',
  list_tags: 'Теги',
  create_tag: 'Теги',
  update_tag: 'Теги',
  delete_tag: 'Теги',
  list_media: 'Медиа',
  get_media: 'Медиа',
  upload_media: 'Медиа',
  update_media_metadata: 'Медиа',
  get_seo_settings: 'SEO',
  update_seo_settings: 'SEO',
  analyze_article_seo: 'SEO',
  get_system_health: 'Система',
  get_site_analytics: 'Система',
  get_audit_log: 'Система',
  generate_slug: 'Контент',
  get_content_brief: 'Контент',
};

type ResultFilter = 'all' | 'success' | 'error';

// --- FilterDropdown ---

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div className='relative'>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors',
          value
            ? 'border-primary/40 bg-primary/5 text-foreground'
            : 'border-border text-muted-foreground hover:text-foreground'
        )}
      >
        <span className='text-muted-foreground'>{label}:</span>
        <span className='font-medium'>{selected?.label || 'Все'}</span>
        <ChevronDown
          className={cn('size-3 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <>
          <div className='fixed inset-0 z-40' onClick={() => setOpen(false)} />
          <div className='absolute top-full left-0 z-50 mt-1 min-w-[160px] rounded-md border bg-popover shadow-md py-1'>
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  'w-full text-left px-3 py-1.5 text-xs transition-colors',
                  opt.value === value
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- Main Component ---

export function McpAuditLog() {
  const [entries] = useState<McpAuditEntry[]>(MOCK_AUDIT_LOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<ResultFilter>('all');
  const [keyFilter, setKeyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Unique keys for filter
  const keyOptions = useMemo(() => {
    const unique = new Map<string, string>();
    for (const key of MOCK_API_KEYS) {
      unique.set(key.keyPrefix, key.name);
    }
    return [
      { value: '', label: 'Все ключи' },
      ...Array.from(unique, ([prefix, name]) => ({
        value: prefix,
        label: name,
      })),
    ];
  }, []);

  // Unique categories for filter
  const categoryOptions = useMemo(() => {
    const cats = new Set<string>();
    for (const e of entries) {
      const cat = TOOL_CATEGORIES[e.tool];
      if (cat) cats.add(cat);
    }
    return [
      { value: '', label: 'Все категории' },
      ...Array.from(cats)
        .sort()
        .map(c => ({ value: c, label: c })),
    ];
  }, [entries]);

  // Filtering
  const filtered = useMemo(() => {
    return entries.filter(e => {
      if (resultFilter !== 'all' && e.result !== resultFilter) return false;
      if (keyFilter && e.keyPrefix !== keyFilter) return false;
      if (categoryFilter && TOOL_CATEGORIES[e.tool] !== categoryFilter)
        return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          e.tool.toLowerCase().includes(q) ||
          e.keyName.toLowerCase().includes(q) ||
          e.keyPrefix.toLowerCase().includes(q) ||
          (e.resourceId && e.resourceId.toLowerCase().includes(q)) ||
          (e.errorMessage && e.errorMessage.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [entries, resultFilter, keyFilter, categoryFilter, searchQuery]);

  const hasActiveFilters =
    resultFilter !== 'all' || keyFilter || categoryFilter || searchQuery;

  const clearFilters = () => {
    setResultFilter('all');
    setKeyFilter('');
    setCategoryFilter('');
    setSearchQuery('');
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Toolbar */}
      <div className='flex-shrink-0 border-b bg-card px-4 py-3'>
        <div className='flex items-center gap-3 flex-wrap'>
          {/* Search */}
          <div className='relative flex-1 min-w-[200px] max-w-sm'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground' />
            <Input
              placeholder='Поиск по tool, ключу, ресурсу...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9 h-8 text-xs'
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                <X className='size-3.5' />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className='flex items-center gap-2'>
            {/* Result filter */}
            <div className='flex items-center rounded-md border divide-x'>
              {(['all', 'success', 'error'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setResultFilter(f)}
                  className={cn(
                    'px-2.5 py-1.5 text-xs font-medium transition-colors',
                    resultFilter === f
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  {f === 'all' && 'Все'}
                  {f === 'success' && (
                    <span className='flex items-center gap-1'>
                      <CheckCircle2 className='size-3' />
                      OK
                    </span>
                  )}
                  {f === 'error' && (
                    <span className='flex items-center gap-1'>
                      <XCircle className='size-3' />
                      Ошибки
                    </span>
                  )}
                </button>
              ))}
            </div>

            <FilterDropdown
              label='Ключ'
              value={keyFilter}
              options={keyOptions}
              onChange={setKeyFilter}
            />
            <FilterDropdown
              label='Категория'
              value={categoryFilter}
              options={categoryOptions}
              onChange={setCategoryFilter}
            />
          </div>

          {/* Results count + clear */}
          <div className='flex items-center gap-2 ml-auto'>
            <span className='text-xs text-muted-foreground'>
              {filtered.length} из {entries.length}
            </span>
            {hasActiveFilters && (
              <Button
                variant='ghost'
                size='sm'
                className='h-7 text-xs gap-1'
                onClick={clearFilters}
              >
                <X className='size-3' />
                Сбросить
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='flex-1 min-h-0 overflow-auto'>
        {filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-muted-foreground'>
            <Search className='size-8 mb-3 opacity-30' />
            <p className='text-sm font-medium'>Записей не найдено</p>
            <p className='text-xs mt-1'>
              {hasActiveFilters
                ? 'Попробуйте изменить параметры фильтрации'
                : 'Лог MCP-действий пока пуст'}
            </p>
          </div>
        ) : (
          <table className='w-full'>
            <thead className='sticky top-0 z-10 bg-muted/30 border-b'>
              <tr className='text-xs font-medium text-muted-foreground/70'>
                <th className='text-left px-4 py-2.5 w-[150px]'>Время</th>
                <th className='text-left px-4 py-2.5'>Tool</th>
                <th className='text-left px-4 py-2.5 w-[200px]'>Ключ</th>
                <th className='text-left px-4 py-2.5 w-[180px]'>Ресурс</th>
                <th className='text-right px-4 py-2.5 w-[80px]'>Время отв.</th>
                <th className='text-center px-4 py-2.5 w-[70px]'>Статус</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => {
                const cat = TOOL_CATEGORIES[entry.tool];
                const isError = entry.result === 'error';
                const isExpanded = expandedRow === entry.id;

                return (
                  <tr
                    key={entry.id}
                    onClick={() => setExpandedRow(isExpanded ? null : entry.id)}
                    className={cn(
                      'border-b border-border/50 text-sm transition-colors cursor-pointer',
                      isError
                        ? 'bg-red-500/[0.03] hover:bg-red-500/[0.06]'
                        : 'hover:bg-muted/40'
                    )}
                  >
                    {/* Время */}
                    <td className='px-4 py-2.5 w-[150px] align-top'>
                      <span className='text-xs text-muted-foreground font-mono whitespace-nowrap'>
                        {formatTimestamp(entry.timestamp)}
                      </span>
                    </td>

                    {/* Tool */}
                    <td className='px-4 py-2.5 align-top'>
                      <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                          <code className='text-xs font-mono font-medium'>
                            {entry.tool}
                          </code>
                          {cat && (
                            <span className='text-[10px] text-muted-foreground/60 bg-muted rounded px-1.5 py-0.5'>
                              {cat}
                            </span>
                          )}
                        </div>
                        {isExpanded && isError && entry.errorMessage && (
                          <div className='flex items-start gap-1.5 mt-1 text-xs text-red-400'>
                            <AlertTriangle className='size-3 mt-0.5 shrink-0' />
                            <span>{entry.errorMessage}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Ключ */}
                    <td className='px-4 py-2.5 w-[200px] align-top'>
                      <div className='flex flex-col'>
                        <span className='text-xs font-medium truncate'>
                          {entry.keyName}
                        </span>
                        <code className='text-[10px] text-muted-foreground/50 font-mono'>
                          {entry.keyPrefix}...
                        </code>
                      </div>
                    </td>

                    {/* Ресурс */}
                    <td className='px-4 py-2.5 w-[180px] align-top'>
                      {entry.resourceId ? (
                        <code className='text-xs text-muted-foreground font-mono truncate block'>
                          {entry.resourceId}
                        </code>
                      ) : (
                        <span className='text-xs text-muted-foreground/30'>
                          —
                        </span>
                      )}
                    </td>

                    {/* Время ответа */}
                    <td className='px-4 py-2.5 w-[80px] text-right align-top'>
                      <span
                        className={cn(
                          'text-xs font-mono',
                          entry.durationMs > 1000
                            ? 'text-amber-400'
                            : 'text-muted-foreground'
                        )}
                      >
                        {formatDuration(entry.durationMs)}
                      </span>
                    </td>

                    {/* Статус */}
                    <td className='px-4 py-2.5 w-[70px] align-top'>
                      <div className='flex justify-center'>
                        {isError ? (
                          <XCircle className='size-4 text-red-500' />
                        ) : (
                          <CheckCircle2 className='size-4 text-green-500' />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
