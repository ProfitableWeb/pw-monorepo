import { useState, useEffect } from 'react';
import { Palette, LayoutDashboard, Pencil } from 'lucide-react';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useHeaderStore } from '@/app/store/header-store';
import { authors } from './style.constants';
import type { StyleMode, StyleStats } from './style.types';
import { SubSectionPlaceholder } from './assets/SubSectionPlaceholder';
import { StyleModeSelector } from './assets/StyleModeSelector';
import { StyleStatusCard } from './assets/StyleStatusCard';
import { MainSettingsSection } from './assets/MainSettingsSection';
import { ToolsSection } from './assets/ToolsSection';
import { VisualContentSection } from './assets/VisualContentSection';
import { AiAgentSection } from './assets/AiAgentSection';
import { TipCard } from './assets/TipCard';

export function StyleDashboard() {
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);
  const [styleMode, setStyleMode] = useState<StyleMode>('editorial');
  const [selectedAuthor, setSelectedAuthor] = useState('current');
  const [authorComboboxOpen, setAuthorComboboxOpen] = useState(false);
  const [useEditorialBase, setUseEditorialBase] = useState(true);

  const setBreadcrumbs = useHeaderStore(state => state.setBreadcrumbs);
  const reset = useHeaderStore(state => state.reset);

  // Устанавливаем breadcrumbs при монтировании компонента
  useEffect(() => {
    setBreadcrumbs([
      {
        label: 'Дашборд',
        href: 'dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Редакция',
        href: 'editorial-hub',
        icon: Pencil,
      },
      {
        label: 'Стиль',
        icon: Palette,
      },
    ]);

    // Сбрасываем при размонтировании
    return () => reset();
  }, [setBreadcrumbs, reset]);

  // Мок-данные статистики
  const styleStats: StyleStats = {
    completeness: styleMode === 'editorial' ? 87 : 72,
    rulesCount: styleMode === 'editorial' ? 24 : 18,
    termsCount: styleMode === 'editorial' ? 47 : 31,
    imagePromptsCount: styleMode === 'editorial' ? 12 : 8,
    lastUpdated: '5 минут назад',
  };

  const currentAuthor = (authors.find(a => a.id === selectedAuthor) ||
    authors[0])!;

  // Если выбран подраздел, показываем его (поа заглушка)
  if (activeSubSection) {
    return (
      <SubSectionPlaceholder
        title={activeSubSection}
        onBack={() => setActiveSubSection(null)}
      />
    );
  }

  // Главный Dashboard
  return (
    <div className='flex-1 overflow-hidden'>
      <ScrollArea className='h-full'>
        <div className='max-w-5xl mx-auto p-6 space-y-8 pb-12'>
          {/* Секция заголовка */}
          <div>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                <Palette className='h-5 w-5 text-primary' />
              </div>
              <div>
                <h1 className='text-2xl font-semibold'>Стиль издания</h1>
                <p className='text-sm text-muted-foreground'>
                  Определите голос, правила написания и визуальный стиль вашего
                  блога
                </p>
              </div>
            </div>

            {/* Выбор стиля */}
            <StyleModeSelector
              styleMode={styleMode}
              onStyleModeChange={setStyleMode}
              selectedAuthor={selectedAuthor}
              onSelectedAuthorChange={setSelectedAuthor}
              authorComboboxOpen={authorComboboxOpen}
              onAuthorComboboxOpenChange={setAuthorComboboxOpen}
              useEditorialBase={useEditorialBase}
              onUseEditorialBaseChange={setUseEditorialBase}
              currentAuthor={currentAuthor}
            />
          </div>

          {/* Карточка обзора статуса */}
          <StyleStatusCard
            styleMode={styleMode}
            styleStats={styleStats}
            currentAuthor={currentAuthor}
          />

          {/* Основные разделы */}
          <MainSettingsSection
            styleStats={styleStats}
            onNavigate={setActiveSubSection}
          />

          {/* Раздел инструментов */}
          <ToolsSection onNavigate={setActiveSubSection} />

          {/* Раздел визуального контента */}
          <VisualContentSection onNavigate={setActiveSubSection} />

          {/* Раздел AI-агента */}
          <AiAgentSection styleStats={styleStats} />

          {/* Советы */}
          <TipCard />
        </div>
      </ScrollArea>
    </div>
  );
}
