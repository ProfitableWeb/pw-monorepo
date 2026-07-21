import type { Metadata } from 'next';
import PrivacyPage from '@/components/app-layout/app-privacy-page';

/**
 * Статический роут /privacy — Политика обработки персональных данных.
 *
 * Юридический документ вынесен в статический роут (а не DB-страницу type=page):
 * версионируется в git, стабилен, не зависит от состояния БД. Статический сегмент
 * `privacy` имеет приоритет над динамическим [slug].
 */
export const metadata: Metadata = {
  title: 'Политика обработки персональных данных',
  description:
    'Политика обработки персональных данных оператора ООО «Открытые Кибернетические Системы» для сервиса ProfitableWeb.',
  alternates: { canonical: 'https://profitableweb.ru/privacy' },
  openGraph: {
    type: 'website',
    url: 'https://profitableweb.ru/privacy',
    title: 'Политика обработки персональных данных',
    description:
      'Порядок обработки персональных данных и меры по обеспечению их безопасности в сервисе ProfitableWeb.',
    siteName: 'ProfitableWeb',
    locale: 'ru_RU',
  },
};

export default function Page() {
  return <PrivacyPage />;
}
