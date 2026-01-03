import type { Metadata } from 'next';
import { AboutHero } from '@/components/about-page/AboutHero';
import { AboutLayout } from '@/components/about-page/AboutLayout';
import { TableOfContents } from '@/components/common/table-of-contents';
import { SidebarWidget } from '@/components/common/sidebar-widget';
import SocialIcons from '@/components/common/social-icons';
import { MissionSection } from '@/components/about-page/MissionSection';
import { ResearchApproach } from '@/components/about-page/ResearchApproach';
import { TargetAudience } from '@/components/about-page/TargetAudience';
import { OpenSourcePhilosophy } from '@/components/about-page/OpenSourcePhilosophy';
import { aboutContent } from '@/config/about-content';

export const metadata: Metadata = {
  title: 'О проекте',
  description:
    'ProfitableWeb Research Lab - открытая лаборатория по исследованию трансформации труда в эпоху AI-автоматизации',
  openGraph: {
    title: 'О проекте | ProfitableWeb',
    description:
      'Исследовательский проект, изучающий механизмы преобразования личных компетенций в автономные цифровые активы',
    locale: 'ru_RU',
  },
};

// Table of Contents данные
const tocItems = [
  { id: 'mission', title: 'Миссия', level: 1 },
  { id: 'approach', title: 'Методология', level: 1 },
  { id: 'audience', title: 'Целевая аудитория', level: 1 },
  { id: 'open-source', title: 'Открытая наука', level: 1 },
];

export default function AboutPage() {
  return (
    <>
      <AboutHero
        title={aboutContent.hero.title}
        subtitle={aboutContent.hero.subtitle}
      />

      <AboutLayout
        tableOfContents={<TableOfContents items={tocItems} />}
        sidebar={
          <>
            <SidebarWidget title="Социальные сети">
              <p style={{ marginBottom: '16px' }}>
                Следите за обновлениями проекта:
              </p>
              <SocialIcons />
            </SidebarWidget>

            <SidebarWidget title="Open Source">
              <p style={{ marginBottom: '16px' }}>
                Весь код проекта доступен в открытом доступе
              </p>
              <a
                href="https://gitverse.ru/profitableweb.ru/pw-monorepo"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitVerse →
              </a>
            </SidebarWidget>

            <SidebarWidget title="Подписаться">
              <p style={{ marginBottom: '16px' }}>
                Получайте инсайты о будущем труда прямо на почту
              </p>
              {/* TODO: Добавить кнопку открытия Newsletter Modal */}
              <button>Подписаться на рассылку</button>
            </SidebarWidget>
          </>
        }
      >
        <MissionSection id="mission" content={aboutContent.mission} />
        <ResearchApproach id="approach" content={aboutContent.approach} />
        <TargetAudience id="audience" content={aboutContent.audience} />
        <OpenSourcePhilosophy
          id="open-source"
          content={aboutContent.openSource}
        />
      </AboutLayout>
    </>
  );
}
