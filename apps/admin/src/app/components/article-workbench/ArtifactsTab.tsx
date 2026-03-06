import { useCallback, useState } from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import {
  CircleHelp,
  Link2,
  BookOpen,
  GitBranch,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import type {
  ArticleFormData,
  SelfCheckItem,
  SourceItem,
  SourceType,
  GlossaryItem,
} from '@/app/types/article-editor';

interface ArtifactsTabProps {
  watch: UseFormWatch<ArticleFormData>;
  setValue: UseFormSetValue<ArticleFormData>;
}

const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  article: 'Статья',
  book: 'Книга',
  video: 'Видео',
  tool: 'Инструмент',
};

type ArtifactKey = 'selfCheck' | 'sources' | 'glossary' | 'provenance';

const NAV_ITEMS: {
  key: ArtifactKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'selfCheck', label: 'Самопроверка', icon: CircleHelp },
  { key: 'sources', label: 'Источники', icon: Link2 },
  { key: 'glossary', label: 'Глоссарий', icon: BookOpen },
  { key: 'provenance', label: 'Происхождение', icon: GitBranch },
];

let _nextId = 1;
function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${_nextId++}`;
}

/* ------------------------------------------------------------------ */
/*  AI Button                                                          */
/* ------------------------------------------------------------------ */

function AiButton({ label, onClick }: { label: string; onClick?: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
    onClick?.();
  }, [onClick]);

  return (
    <Button
      type='button'
      variant='outline'
      size='sm'
      className='gap-1.5 text-xs'
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className='size-3.5 animate-spin' />
      ) : (
        <Sparkles className='size-3.5' />
      )}
      {label}
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/*  Self-Check module                                                  */
/* ------------------------------------------------------------------ */

function SelfCheckModule({
  items,
  onChange,
}: {
  items: SelfCheckItem[];
  onChange: (items: SelfCheckItem[]) => void;
}) {
  const updateItem = (
    id: string,
    field: 'question' | 'answer',
    value: string
  ) => {
    onChange(items.map(it => (it.id === id ? { ...it, [field]: value } : it)));
  };
  const removeItem = (id: string) => onChange(items.filter(it => it.id !== id));
  const addItem = () =>
    onChange([...items, { id: nextId('sc'), question: '', answer: '' }]);

  return (
    <div className='space-y-3'>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className='group/item space-y-1.5 p-3 rounded-md border'
        >
          <div className='flex items-start gap-2'>
            <span className='text-xs text-muted-foreground tabular-nums mt-2 shrink-0'>
              {idx + 1}.
            </span>
            <div className='flex-1 space-y-1.5'>
              <Input
                placeholder='Вопрос...'
                value={item.question}
                onChange={e => updateItem(item.id, 'question', e.target.value)}
              />
              <Textarea
                placeholder='Ответ / подсказка...'
                value={item.answer}
                onChange={e => updateItem(item.id, 'answer', e.target.value)}
                rows={2}
                className='resize-none'
              />
            </div>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-7 text-muted-foreground/40 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0 mt-1'
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className='size-3.5' />
            </Button>
          </div>
        </div>
      ))}
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='gap-1.5 text-xs'
          onClick={addItem}
        >
          <Plus className='size-3.5' />
          Добавить вопрос
        </Button>
        <AiButton label='Сгенерировать вопросы' />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sources module                                                     */
/* ------------------------------------------------------------------ */

function SourcesModule({
  items,
  onChange,
}: {
  items: SourceItem[];
  onChange: (items: SourceItem[]) => void;
}) {
  const updateItem = (
    id: string,
    field: keyof Omit<SourceItem, 'id'>,
    value: string
  ) => {
    onChange(items.map(it => (it.id === id ? { ...it, [field]: value } : it)));
  };
  const removeItem = (id: string) => onChange(items.filter(it => it.id !== id));
  const addItem = () =>
    onChange([
      ...items,
      { id: nextId('src'), title: '', url: '', type: 'article' as SourceType },
    ]);

  return (
    <div className='space-y-3'>
      {items.map(item => (
        <div
          key={item.id}
          className='group/item flex items-start gap-2 p-3 rounded-md border'
        >
          <div className='flex-1 space-y-1.5'>
            <div className='flex gap-1.5'>
              <Input
                placeholder='Название источника...'
                value={item.title}
                onChange={e => updateItem(item.id, 'title', e.target.value)}
                className='flex-1'
              />
              <Select
                value={item.type}
                onValueChange={v => updateItem(item.id, 'type', v)}
              >
                <SelectTrigger className='w-[120px]' size='sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(SOURCE_TYPE_LABELS) as [SourceType, string][]
                  ).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder='https://...'
              value={item.url}
              onChange={e => updateItem(item.id, 'url', e.target.value)}
            />
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-7 text-muted-foreground/40 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0 mt-1'
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className='size-3.5' />
          </Button>
        </div>
      ))}
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='gap-1.5 text-xs'
          onClick={addItem}
        >
          <Plus className='size-3.5' />
          Добавить источник
        </Button>
        <AiButton label='Импорт из Workspace' />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Glossary module                                                    */
/* ------------------------------------------------------------------ */

function GlossaryModule({
  items,
  onChange,
}: {
  items: GlossaryItem[];
  onChange: (items: GlossaryItem[]) => void;
}) {
  const updateItem = (
    id: string,
    field: 'term' | 'definition',
    value: string
  ) => {
    onChange(items.map(it => (it.id === id ? { ...it, [field]: value } : it)));
  };
  const removeItem = (id: string) => onChange(items.filter(it => it.id !== id));
  const addItem = () =>
    onChange([...items, { id: nextId('gl'), term: '', definition: '' }]);

  return (
    <div className='space-y-3'>
      {items.map(item => (
        <div
          key={item.id}
          className='group/item flex items-start gap-2 p-3 rounded-md border'
        >
          <div className='flex-1 space-y-1.5'>
            <Input
              placeholder='Термин...'
              value={item.term}
              onChange={e => updateItem(item.id, 'term', e.target.value)}
            />
            <Textarea
              placeholder='Определение...'
              value={item.definition}
              onChange={e => updateItem(item.id, 'definition', e.target.value)}
              rows={2}
              className='resize-none'
            />
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-7 text-muted-foreground/40 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0 mt-1'
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className='size-3.5' />
          </Button>
        </div>
      ))}
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='gap-1.5 text-xs'
          onClick={addItem}
        >
          <Plus className='size-3.5' />
          Добавить термин
        </Button>
        <AiButton label='Найти термины в тексте' />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Provenance module                                                  */
/* ------------------------------------------------------------------ */

const MOCK_WORKSPACES = [
  { id: 'ws-1', name: 'AI и автоматизация труда — исследование' },
  { id: 'ws-2', name: 'Рынок труда: статистика 2023–2026' },
  { id: 'ws-3', name: 'Интервью с HR-директорами' },
];

function ProvenanceModule({
  workspaceId,
  showLink,
  onWorkspaceChange,
  onShowLinkChange,
}: {
  workspaceId: string;
  showLink: boolean;
  onWorkspaceChange: (v: string) => void;
  onShowLinkChange: (v: boolean) => void;
}) {
  return (
    <div className='space-y-4'>
      <div className='space-y-1.5'>
        <Label className='text-xs'>Research Workspace</Label>
        <Select value={workspaceId} onValueChange={onWorkspaceChange}>
          <SelectTrigger>
            <SelectValue placeholder='Выберите рабочее пространство...' />
          </SelectTrigger>
          <SelectContent>
            {MOCK_WORKSPACES.map(ws => (
              <SelectItem key={ws.id} value={ws.id}>
                {ws.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center justify-between'>
        <Label htmlFor='provenance-link' className='text-xs'>
          Показывать ссылку на материалы
        </Label>
        <Switch
          id='provenance-link'
          checked={showLink}
          onCheckedChange={onShowLinkChange}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ArtifactsTab                                                       */
/* ------------------------------------------------------------------ */

export function ArtifactsTab({ watch, setValue }: ArtifactsTabProps) {
  const artifacts = watch('artifacts');
  const [activeKey, setActiveKey] = useState<ArtifactKey>('selfCheck');

  const update = useCallback(
    (path: string, value: unknown) => {
      setValue(`artifacts.${path}` as any, value as any);
    },
    [setValue]
  );

  const renderContent = () => {
    switch (activeKey) {
      case 'selfCheck':
        return (
          <SelfCheckModule
            items={artifacts.selfCheck.items}
            onChange={items => update('selfCheck.items', items)}
          />
        );
      case 'sources':
        return (
          <SourcesModule
            items={artifacts.sources.items}
            onChange={items => update('sources.items', items)}
          />
        );
      case 'glossary':
        return (
          <GlossaryModule
            items={artifacts.glossary.items}
            onChange={items => update('glossary.items', items)}
          />
        );
      case 'provenance':
        return (
          <ProvenanceModule
            workspaceId={artifacts.provenance.workspaceId}
            showLink={artifacts.provenance.showLink}
            onWorkspaceChange={v => update('provenance.workspaceId', v)}
            onShowLinkChange={v => update('provenance.showLink', v)}
          />
        );
    }
  };

  return (
    <div className='flex h-full'>
      {/* Left sidebar — navigation */}
      <nav className='w-52 shrink-0 border-r flex flex-col py-2'>
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = activeKey === key;
          const enabled = artifacts[key].enabled;
          return (
            <button
              key={key}
              type='button'
              onClick={() => setActiveKey(key)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              }`}
            >
              <Icon className='size-4 shrink-0' />
              <span className='flex-1 truncate'>{label}</span>
              <Switch
                checked={enabled}
                onCheckedChange={v => update(`${key}.enabled`, v)}
                className='scale-75 origin-right'
                onClick={e => e.stopPropagation()}
              />
            </button>
          );
        })}
      </nav>

      {/* Right content — selected module */}
      <div className='flex-1 min-w-0'>
        <ScrollArea className='h-full [&_[data-slot=scroll-area-viewport]]:!block [&_[data-slot=scroll-area-viewport]>div]:!block'>
          <div className='max-w-2xl p-6'>
            <h3 className='text-sm font-semibold mb-4'>
              {NAV_ITEMS.find(n => n.key === activeKey)?.label}
            </h3>
            {renderContent()}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
