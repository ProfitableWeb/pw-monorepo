import { useHeaderStore } from '@/app/store/header-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';
import { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useAIStore } from '@/app/store/ai-store';
import { cn } from '@/app/components/ui/utils';
import type { ManifestPageProps, ManifestData } from './manifest.types';
import {
  NAVIGATION_ITEMS,
  defaultManifest,
  sections,
} from './manifest.constants';
import { generateMarkdown } from './manifest.utils';
import { ManifestDocSection } from './ManifestDocSection';
import {
  MissionSection,
  AudienceSection,
  PositioningSection,
  ContentStrategySection,
  EditorialSection,
  MetricsSection,
  DevelopmentSection,
} from './ManifestStubSections';

export function ManifestPage({ onNavigateToAI }: ManifestPageProps) {
  const [activeSubsection, setActiveSubsection] = useState('manifest-doc');
  const [searchQuery, setSearchQuery] = useState('');

  const [manifest, setManifest] = useState<ManifestData>(defaultManifest);
  const [activeTab, setActiveTab] = useState('view');
  const [saved, setSaved] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Zustand-стор AI
  const switchSession = useAIStore(state => state.switchSession);

  // Стор заголовка для хлебных крошек
  const { setBreadcrumbs, reset } = useHeaderStore();

  // Установить хлебные крошки при монтировании
  useEffect(() => {
    updateBreadcrumbs(activeSubsection);

    return () => reset();
  }, []);

  // Обновить хлебные крошки при смене подраздела
  useEffect(() => {
    updateBreadcrumbs(activeSubsection);
  }, [activeSubsection]);

  const updateBreadcrumbs = (subsectionId: string) => {
    const baseBreadcrumbs = breadcrumbPresets.manifest();

    // Найти метку текущего подраздела
    const subsection = NAVIGATION_ITEMS.find(item => item.id === subsectionId);
    if (subsection) {
      setBreadcrumbs([
        ...baseBreadcrumbs,
        { label: subsection.label, icon: subsection.icon },
      ]);
    } else {
      setBreadcrumbs(baseBreadcrumbs);
    }
  };

  // Загрузить манифест из localStorage
  useEffect(() => {
    const savedManifest = localStorage.getItem('manifest');
    if (savedManifest) {
      try {
        setManifest(JSON.parse(savedManifest));
      } catch (e) {
        console.error('Error loading manifest:', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('manifest', JSON.stringify(manifest));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const manifestText = generateMarkdown(manifest);
    const blob = new Blob([manifestText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateField = (
    section: keyof ManifestData,
    field: string,
    value: string
  ) => {
    setManifest(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const getCompletionPercentage = () => {
    let total = 0;
    let filled = 0;
    sections.forEach(section => {
      section.fields.forEach(field => {
        total++;
        const value = (manifest[section.id as keyof ManifestData] as any)[
          field.key
        ];
        if (value && value.trim().length > 0) {
          filled++;
        }
      });
    });
    return Math.round((filled / total) * 100);
  };

  const isSectionComplete = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return false;

    return section.fields.every(field => {
      const value = (manifest[section.id as keyof ManifestData] as any)[
        field.key
      ];
      return value && value.trim().length > 0;
    });
  };

  const handleCompleteWizard = () => {
    // Переключиться на сессию создания манифеста
    switchSession('session-2');

    // Перейти в AI-центр
    if (onNavigateToAI) {
      onNavigateToAI();
    }

    // Сбросить визард
    setCurrentQuestion(0);
    setAnswers({});
    setActiveTab('view');
  };

  const renderSubsection = () => {
    switch (activeSubsection) {
      case 'manifest-doc':
        return (
          <ManifestDocSection
            manifest={manifest}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            saved={saved}
            currentQuestion={currentQuestion}
            answers={answers}
            onSave={handleSave}
            onExport={handleExport}
            updateField={updateField}
            getCompletionPercentage={getCompletionPercentage}
            isSectionComplete={isSectionComplete}
            setCurrentQuestion={setCurrentQuestion}
            setAnswers={setAnswers}
            handleCompleteWizard={handleCompleteWizard}
          />
        );
      case 'mission':
        return <MissionSection />;
      case 'audience':
        return <AudienceSection />;
      case 'positioning':
        return <PositioningSection />;
      case 'content-strategy':
        return <ContentStrategySection />;
      case 'editorial':
        return <EditorialSection />;
      case 'metrics':
        return <MetricsSection />;
      case 'development':
        return <DevelopmentSection />;
      default:
        return null;
    }
  };

  return (
    <div className='flex h-full overflow-hidden'>
      {/* Боковая навигация */}
      <aside className='w-64 border-r bg-card flex-shrink-0 flex flex-col'>
        <div className='p-4 border-b flex-shrink-0'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Поиск...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>
        </div>

        <ScrollArea className='flex-1 min-h-0'>
          <nav className='p-2'>
            {NAVIGATION_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeSubsection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubsection(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  )}
                >
                  <Icon className='size-4 flex-shrink-0' />
                  <span className='flex-1 text-left'>{item.label}</span>
                  <ChevronRight
                    className={cn(
                      'size-4 transition-transform flex-shrink-0',
                      isActive && 'rotate-90'
                    )}
                  />
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Основной контент */}
      <div className='flex-1 flex flex-col min-w-0 min-h-0'>
        {renderSubsection()}
      </div>
    </div>
  );
}
