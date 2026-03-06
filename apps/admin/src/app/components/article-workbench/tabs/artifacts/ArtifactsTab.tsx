/**
 * Вкладка «Артефакты» — дополнительные материалы к статье.
 *
 * Боковая навигация слева (4 секции), контент справа.
 * Каждая секция — отдельный модуль-компонент с CRUD-логикой:
 * - SelfCheckModule — вопросы для самопроверки читателя
 * - SourcesModule — источники (статья, книга, видео, инструмент)
 * - GlossaryModule — глоссарий терминов
 * - ProvenanceModule — привязка к research workspace
 *
 * Каждый модуль можно включить/выключить переключателем в навигации.
 */
import { useCallback, useState } from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Switch } from '@/app/components/ui/switch';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { CircleHelp, Link2, BookOpen, GitBranch } from 'lucide-react';
import type { ArticleFormData } from '@/app/types/article-editor';
import { SelfCheckModule } from './SelfCheckModule';
import { SourcesModule } from './SourcesModule';
import { GlossaryModule } from './GlossaryModule';
import { ProvenanceModule } from './ProvenanceModule';

interface ArtifactsTabProps {
  watch: UseFormWatch<ArticleFormData>;
  setValue: UseFormSetValue<ArticleFormData>;
}

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
