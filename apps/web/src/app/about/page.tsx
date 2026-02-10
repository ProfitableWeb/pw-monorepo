import type { Metadata } from 'next';
import { AboutPageClient } from '@/components/about-page/about-page-client';

export const metadata: Metadata = {
  title: 'О проекте',
  description:
    'ProfitableWeb - исследовательский блог по созданию доходных веб-проектов',
  openGraph: {
    title: 'О проекте | ProfitableWeb',
    description: 'Исследовательский блог по созданию доходных веб-проектов',
    locale: 'ru_RU',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
