import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';
import { SETTINGS_SECTIONS } from './calendar-settings.constants';
import type {
  CalendarSettingsDialogProps,
  SettingsSection,
} from './calendar-settings.types';
import { GeneralSection } from './assets/GeneralSection';
import { AppearanceSection } from './assets/AppearanceSection';
import { AiAgentSection } from './assets/AiAgentSection';
import { ContentPlanSection } from './assets/ContentPlanSection';
import { NotificationsSection } from './assets/NotificationsSection';
import { IntegrationsSection } from './assets/IntegrationsSection';

const SECTION_COMPONENTS: Record<SettingsSection, React.FC> = {
  general: GeneralSection,
  appearance: AppearanceSection,
  'ai-agent': AiAgentSection,
  'content-plan': ContentPlanSection,
  notifications: NotificationsSection,
  integrations: IntegrationsSection,
};

export function CalendarSettingsDialog({
  open,
  onOpenChange,
}: CalendarSettingsDialogProps) {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>('general');

  const ActiveContent = SECTION_COMPONENTS[activeSection];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='!max-w-6xl md:w-[90vw] w-full md:h-[85vh] h-[90vh] md:top-[50%] top-auto md:bottom-auto bottom-0 md:translate-y-[-50%] translate-y-0 md:rounded-lg rounded-t-2xl rounded-b-none p-0 gap-0 flex flex-col'>
        {/* Ручка перетаскивания (мобильная) */}
        <div className='md:hidden flex justify-center pt-2 pb-1 shrink-0'>
          <div className='w-10 h-1 rounded-full bg-muted-foreground/30' />
        </div>

        <div className='px-4 md:px-6 py-3 border-b shrink-0'>
          <DialogTitle className='text-base md:text-lg font-semibold'>
            Настройки календаря публикаций
          </DialogTitle>
          <DialogDescription className='text-xs md:text-sm text-muted-foreground'>
            Настройте параметры календаря публикаций, чтобы он соответствовал
            вашим потребностям.
          </DialogDescription>
        </div>

        <div className='flex md:flex-row flex-col flex-1 overflow-hidden min-h-0'>
          {/* Десктоп: левая навигация | Мобильная: верхняя навигация */}
          <div className='md:w-64 w-full md:border-r border-b md:border-b-0 md:bg-muted/30 bg-background md:p-4 p-0 shrink-0'>
            <nav className='md:space-y-1 flex md:flex-col flex-row md:overflow-visible overflow-x-auto scrollbar-mobile'>
              {SETTINGS_SECTIONS.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'flex items-center gap-2 md:gap-3 md:px-3 px-4 md:py-2 py-3 md:rounded-lg text-xs md:text-sm transition-colors md:w-full whitespace-nowrap shrink-0',
                      activeSection === section.id
                        ? 'md:bg-muted bg-background text-foreground border-b-2 md:border-b-0 border-primary'
                        : 'md:hover:bg-muted/50 hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className='h-4 w-4 shrink-0' />
                    <span className='md:inline'>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Контент — фиксированная высота на мобильных против прыжков */}
          <div className='flex-1 overflow-y-auto p-4 md:p-6 scrollbar-mobile min-h-0'>
            <ActiveContent />
          </div>
        </div>

        <div className='px-4 md:px-6 py-3 border-t flex justify-end gap-2 shrink-0'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='text-sm'
          >
            Отмена
          </Button>
          <Button onClick={() => onOpenChange(false)} className='text-sm'>
            Сохранить изменения
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
