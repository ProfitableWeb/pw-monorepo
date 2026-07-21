import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { POLICY_META, POLICY_SECTIONS } from './privacyContent';
import './PrivacyPage.scss';

/**
 * Страница «Политика обработки персональных данных» (/privacy).
 *
 * Обязательный по ч. 2 ст. 18.1 ФЗ-152 документ оператора ООО «ОКС» для сервиса
 * ProfitableWeb. Открытый доступ без авторизации; контент — из privacyContent.ts.
 */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const PrivacyPage = () => {
  return (
    <div className='privacy-page'>
      <AppBar />
      <AppPageWrapper>
        <main className='privacy-page__main'>
          <article className='privacy-page__content'>
            <header className='privacy-page__header'>
              <h1 className='privacy-page__title'>
                Политика обработки персональных данных
              </h1>
              <p className='privacy-page__meta'>
                Оператор: {POLICY_META.operator}. Сервис: {POLICY_META.service}.
                <br />
                Редакция от {formatDate(POLICY_META.revision)}
              </p>
            </header>

            {POLICY_SECTIONS.map(section => (
              <section
                key={section.id}
                id={section.id}
                className='privacy-page__section'
              >
                <h2 className='privacy-page__section-title'>
                  {section.number}. {section.title}
                </h2>
                {section.blocks.map((block, i) =>
                  block.type === 'list' ? (
                    <ul key={i} className='privacy-page__list'>
                      {block.items?.map((item, j) => (
                        <li key={j} className='privacy-page__list-item'>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i} className='privacy-page__paragraph'>
                      {block.text}
                    </p>
                  )
                )}
              </section>
            ))}

            <footer className='privacy-page__contacts'>
              По вопросам обработки персональных данных:{' '}
              <a href={`mailto:${POLICY_META.contactEmail}`}>
                {POLICY_META.contactEmail}
              </a>
            </footer>
          </article>
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};

export default PrivacyPage;
