import { useMemo, useState } from 'react';
import {
  Plus,
  Copy,
  Check,
  Ban,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Search,
  ArrowUpDown,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { cn } from '@/app/components/ui/utils';
import { useMcpKeys, useCreateMcpKey, useRevokeMcpKey } from '@/hooks/api';
import type { McpApiKey, McpKeyScope } from './mcp.types';

const SCOPE_CONFIG: Record<
  McpKeyScope,
  { label: string; color: string; icon: typeof Shield; description: string }
> = {
  read: {
    label: 'Чтение',
    color: 'text-blue-400 bg-blue-400/10',
    icon: Shield,
    description: 'Только просмотр данных',
  },
  write: {
    label: 'Запись',
    color: 'text-amber-400 bg-amber-400/10',
    icon: ShieldCheck,
    description: 'Чтение + создание и редактирование',
  },
  admin: {
    label: 'Админ',
    color: 'text-red-400 bg-red-400/10',
    icon: ShieldAlert,
    description: 'Полный доступ включая удаление',
  },
};

const EXPIRY_OPTIONS = [
  { label: 'Без ограничений', value: '' },
  { label: '30 дней', value: '30' },
  { label: '90 дней', value: '90' },
  { label: '1 год', value: '365' },
];

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRelative(iso: string | null): string {
  if (!iso) return 'Никогда';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Только что';
  if (mins < 60) return `${mins} мин назад`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} дн назад`;
  return formatDate(iso);
}

// --- Create Key Dialog ---

interface CreateKeyDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (rawKey: string) => void;
}

function CreateKeyDialog({ open, onClose, onCreated }: CreateKeyDialogProps) {
  const [name, setName] = useState('');
  const [scope, setScope] = useState<McpKeyScope>('write');
  const [expiry, setExpiry] = useState('');
  const createMutation = useCreateMcpKey();

  if (!open) return null;

  const handleCreate = () => {
    createMutation.mutate(
      {
        name: name || 'Новый ключ',
        scope,
        expires_in_days: expiry ? parseInt(expiry) : null,
      },
      {
        onSuccess: result => {
          onCreated(result.rawKey);
          setName('');
          setScope('write');
          setExpiry('');
        },
      }
    );
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <div className='bg-card border rounded-lg shadow-xl w-full max-w-md p-6'>
        <h3 className='text-lg font-semibold mb-4'>Создать API-ключ</h3>

        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-muted-foreground mb-1 block'>
              Название
            </label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Claude Desktop — Николай'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-muted-foreground mb-2 block'>
              Права доступа
            </label>
            <div className='grid grid-cols-3 gap-2'>
              {(
                Object.entries(SCOPE_CONFIG) as [
                  McpKeyScope,
                  typeof SCOPE_CONFIG.read,
                ][]
              ).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setScope(key)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-lg border p-3 text-xs transition-colors',
                      scope === key
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:bg-muted'
                    )}
                  >
                    <Icon
                      className={cn('h-5 w-5', config.color.split(' ')[0])}
                    />
                    <span className='font-medium'>{config.label}</span>
                  </button>
                );
              })}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {SCOPE_CONFIG[scope].description}
            </p>
          </div>

          <div>
            <label className='text-sm font-medium text-muted-foreground mb-1 block'>
              Срок действия
            </label>
            <Select
              value={expiry || 'none'}
              onValueChange={v => setExpiry(v === 'none' ? '' : v)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPIRY_OPTIONS.map(opt => (
                  <SelectItem
                    key={opt.value || 'none'}
                    value={opt.value || 'none'}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {createMutation.error && (
            <p className='text-xs text-red-400 flex items-center gap-1'>
              <AlertTriangle className='size-3' />
              {createMutation.error.message}
            </p>
          )}
        </div>

        <div className='flex justify-end gap-2 mt-6'>
          <Button variant='ghost' onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending && (
              <Loader2 className='h-4 w-4 animate-spin mr-1' />
            )}
            Создать
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Key Created Modal ---

interface KeyCreatedModalProps {
  rawKey: string;
  onClose: () => void;
}

function KeyCreatedModal({ rawKey, onClose }: KeyCreatedModalProps) {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(true);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rawKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CLIENT_CONFIGS = [
    {
      name: 'Claude Desktop',
      config: JSON.stringify(
        {
          mcpServers: {
            profitableweb: {
              url: 'https://api.profitableweb.ru/mcp',
              headers: { Authorization: `Bearer ${rawKey}` },
            },
          },
        },
        null,
        2
      ),
    },
    {
      name: 'Cursor',
      config: JSON.stringify(
        {
          mcpServers: {
            profitableweb: {
              url: 'https://api.profitableweb.ru/mcp',
              headers: { Authorization: `Bearer ${rawKey}` },
            },
          },
        },
        null,
        2
      ),
    },
    {
      name: 'Claude Code',
      config: `claude mcp add profitableweb \\
  --transport http \\
  --url https://api.profitableweb.ru/mcp \\
  --header "Authorization: Bearer ${rawKey}"`,
    },
    {
      name: 'OpenCode',
      config: JSON.stringify(
        {
          mcpServers: {
            profitableweb: {
              url: 'https://api.profitableweb.ru/mcp',
              headers: { Authorization: `Bearer ${rawKey}` },
            },
          },
        },
        null,
        2
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const [configCopied, setConfigCopied] = useState(false);

  const handleCopyConfig = async () => {
    const cfg = CLIENT_CONFIGS[activeTab];
    if (cfg) {
      await navigator.clipboard.writeText(cfg.config);
      setConfigCopied(true);
      setTimeout(() => setConfigCopied(false), 2000);
    }
  };

  const activeConfig = CLIENT_CONFIGS[activeTab];

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <div className='bg-card border rounded-lg shadow-xl w-full max-w-lg p-6'>
        <div className='flex items-center gap-2 mb-4'>
          <div className='h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center'>
            <Check className='h-4 w-4 text-green-500' />
          </div>
          <h3 className='text-lg font-semibold'>Ключ создан</h3>
        </div>

        <div className='bg-muted rounded-lg p-3 mb-2'>
          <div className='flex items-center gap-2'>
            <code className='flex-1 text-sm font-mono break-all'>
              {showKey ? rawKey : '\u2022'.repeat(rawKey.length)}
            </code>
            <Button
              variant='ghost'
              size='icon'
              className='shrink-0 h-8 w-8'
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='shrink-0 h-8 w-8'
              onClick={handleCopy}
            >
              {copied ? (
                <Check className='h-4 w-4 text-green-500' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>

        <p className='text-xs text-amber-400 mb-4'>
          Ключ показывается один раз. Сохраните его сейчас.
        </p>

        <div className='border rounded-lg'>
          <div className='flex border-b'>
            {CLIENT_CONFIGS.map((cfg, i) => (
              <button
                key={cfg.name}
                onClick={() => setActiveTab(i)}
                className={cn(
                  'flex-1 px-3 py-2 text-xs font-medium transition-colors',
                  activeTab === i
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {cfg.name}
              </button>
            ))}
          </div>
          <div className='p-3 relative'>
            <pre className='text-xs font-mono whitespace-pre-wrap text-muted-foreground max-h-48 overflow-auto'>
              {activeConfig?.config}
            </pre>
            <Button
              variant='ghost'
              size='sm'
              className='absolute top-2 right-2 h-7 text-xs gap-1'
              onClick={handleCopyConfig}
            >
              {configCopied ? (
                <Check className='h-3 w-3 text-green-500' />
              ) : (
                <Copy className='h-3 w-3' />
              )}
              {configCopied ? 'Скопировано' : 'Копировать'}
            </Button>
          </div>
        </div>

        <div className='flex justify-end mt-4'>
          <Button onClick={onClose}>Готово</Button>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

type SortField = 'name' | 'scope' | 'lastUsedAt' | 'createdAt';
type SortDir = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive';

const SCOPE_ORDER: Record<McpKeyScope, number> = {
  read: 0,
  write: 1,
  admin: 2,
};

export function McpApiKeys() {
  const { data: keys = [], isLoading, error } = useMcpKeys();
  const revokeMutation = useRevokeMcpKey();

  const [showCreate, setShowCreate] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = keys;

    // Status
    if (statusFilter === 'active') result = result.filter(k => k.isActive);
    if (statusFilter === 'inactive') result = result.filter(k => !k.isActive);

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        k =>
          k.name.toLowerCase().includes(q) ||
          k.keyPrefix.toLowerCase().includes(q) ||
          k.scope.toLowerCase().includes(q)
      );
    }

    // Sort
    const dir = sortDir === 'asc' ? 1 : -1;
    result = [...result].sort((a, b) => {
      switch (sortField) {
        case 'name':
          return dir * a.name.localeCompare(b.name, 'ru');
        case 'scope':
          return dir * (SCOPE_ORDER[a.scope] - SCOPE_ORDER[b.scope]);
        case 'lastUsedAt': {
          const ta = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
          const tb = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
          return dir * (ta - tb);
        }
        case 'createdAt':
          return (
            dir *
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          );
        default:
          return 0;
      }
    });

    return result;
  }, [keys, searchQuery, statusFilter, sortField, sortDir]);

  const handleCreated = (rawKey: string) => {
    setShowCreate(false);
    setCreatedKey(rawKey);
  };

  const handleRevoke = (key: McpApiKey) => {
    if (!confirm(`Деактивировать ключ «${key.name}»?`)) return;
    revokeMutation.mutate(key.id);
  };

  const hasFilters = searchQuery || statusFilter !== 'all';

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-3'>
          <CardTitle className='text-base'>Ключи доступа</CardTitle>
          <Button
            size='sm'
            className='gap-1.5'
            onClick={() => setShowCreate(true)}
          >
            <Plus className='h-4 w-4' />
            Создать ключ
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search + filters + sort */}
          <div className='flex items-center gap-2 mb-3 flex-wrap'>
            <div className='relative flex-1 min-w-[180px]'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground' />
              <Input
                placeholder='Поиск по имени, префиксу...'
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

            {/* Status filter */}
            <div className='flex items-center rounded-md border divide-x'>
              {(['all', 'active', 'inactive'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={cn(
                    'px-2.5 py-1.5 text-xs font-medium transition-colors',
                    statusFilter === f
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  {f === 'all' && 'Все'}
                  {f === 'active' && 'Активные'}
                  {f === 'inactive' && 'Неактивные'}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className='flex items-center gap-1'>
              {[
                { field: 'name' as SortField, label: 'Имя' },
                { field: 'scope' as SortField, label: 'Права' },
                { field: 'lastUsedAt' as SortField, label: 'Использован' },
                { field: 'createdAt' as SortField, label: 'Создан' },
              ].map(({ field, label }) => (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1.5 rounded text-xs transition-colors',
                    sortField === field
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {label}
                  {sortField === field && (
                    <ArrowUpDown
                      className={cn(
                        'size-3',
                        sortDir === 'desc' && 'rotate-180'
                      )}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className='flex items-center justify-center py-8 text-muted-foreground'>
              <Loader2 className='h-5 w-5 animate-spin mr-2' />
              <span className='text-sm'>Загрузка ключей...</span>
            </div>
          ) : error ? (
            <div className='flex items-center justify-center py-8 text-red-400'>
              <AlertTriangle className='h-5 w-5 mr-2' />
              <span className='text-sm'>Ошибка загрузки: {error.message}</span>
            </div>
          ) : filtered.length === 0 ? (
            <p className='text-sm text-muted-foreground text-center py-8'>
              {hasFilters
                ? 'Ключи не найдены. Попробуйте изменить параметры поиска.'
                : 'Нет API-ключей. Создайте первый для подключения AI-ассистента.'}
            </p>
          ) : (
            <div className='space-y-2'>
              {filtered.map(key => {
                const scopeCfg = SCOPE_CONFIG[key.scope];
                const ScopeIcon = scopeCfg.icon;
                return (
                  <div
                    key={key.id}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                      !key.isActive && 'opacity-50'
                    )}
                  >
                    <ScopeIcon
                      className={cn(
                        'h-5 w-5 shrink-0',
                        scopeCfg.color.split(' ')[0]
                      )}
                    />

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium truncate'>
                          {key.name}
                        </span>
                        <code className='text-xs text-muted-foreground font-mono'>
                          {key.keyPrefix}...
                        </code>
                      </div>
                      <div className='flex items-center gap-3 text-xs text-muted-foreground mt-0.5'>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                            scopeCfg.color
                          )}
                        >
                          {scopeCfg.label}
                        </span>
                        <span>
                          Использован: {formatRelative(key.lastUsedAt)}
                        </span>
                        {key.expiresAt && (
                          <span>Истекает: {formatDate(key.expiresAt)}</span>
                        )}
                        {key.userName && <span>Владелец: {key.userName}</span>}
                      </div>
                    </div>

                    <div className='flex items-center gap-1 shrink-0'>
                      {key.isActive && (
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() => handleRevoke(key)}
                          disabled={revokeMutation.isPending}
                          title='Деактивировать'
                        >
                          <Ban className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateKeyDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />

      {createdKey && (
        <KeyCreatedModal
          rawKey={createdKey}
          onClose={() => setCreatedKey(null)}
        />
      )}
    </>
  );
}
