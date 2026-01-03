'use client';

import React from 'react';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { AboutHero } from '@/components/about-page/about-hero';
import { AboutLayout } from '@/components/about-page/about-layout';
import { AboutSection } from '@/components/about-page/about-section';
import { TableOfContents } from '@/components/common/table-of-contents';
import { QuoteBlock } from '@/components/common/quote-block';
import { AuthorCard } from '@/components/common/author-card';
import { aboutContent } from '@/config/about-content';

// Table of Contents данные
const tocItems = [
  { id: 'intro', title: 'Общее про проект', level: 1 },
  { id: 'mission', title: 'Миссия проекта', level: 1 },
  { id: 'philosophy', title: 'Философия проекта', level: 1 },
  { id: 'why-works', title: 'Почему это работает?', level: 1 },
  { id: 'many-topics', title: 'Почему здесь так много тематик?', level: 1 },
  { id: 'direction', title: 'Куда всё это движется?', level: 1 },
];

export const AboutPageClient: React.FC = () => {
  return (
    <div className="about-page" suppressHydrationWarning>
      <AppBar />
      <AppPageWrapper>
        <main>
          <AboutHero
            title={aboutContent.hero.title}
            subtitle={aboutContent.hero.subtitle}
          />

          <AboutLayout
            tableOfContents={<TableOfContents items={tocItems} />}
            sidebar={
              <AuthorCard
                name={aboutContent.author.name}
                description={aboutContent.author.description}
                subscribeLink={aboutContent.author.subscribeLink}
              />
            }
          >
            {/* Intro Section */}
            <AboutSection id="intro">
              {aboutContent.intro.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </AboutSection>

            {/* Methodology Quote */}
            <QuoteBlock title={aboutContent.methodology.quote.title}>
              <p>{aboutContent.methodology.quote.text}</p>
            </QuoteBlock>

            <AboutSection>
              {aboutContent.methodology.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </AboutSection>

            {/* Mission Section */}
            <AboutSection id="mission" heading={aboutContent.mission.heading}>
              {aboutContent.mission.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              <blockquote>
                {aboutContent.mission.quote.text}
                <cite>{aboutContent.mission.quote.author}</cite>
              </blockquote>

              {aboutContent.mission.afterQuote.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </AboutSection>

            {/* Philosophy Section */}
            <AboutSection
              id="philosophy"
              heading={aboutContent.philosophy.heading}
            >
              <p>{aboutContent.philosophy.intro}</p>
              {aboutContent.philosophy.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </AboutSection>

            {/* Why It Works Section */}
            <AboutSection
              id="why-works"
              heading={aboutContent.whyItWorks.heading}
            >
              <p>{aboutContent.whyItWorks.intro}</p>

              <QuoteBlock>
                <ul>
                  {aboutContent.whyItWorks.quote.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </QuoteBlock>

              {aboutContent.whyItWorks.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </AboutSection>

            {/* Many Topics Section */}
            <AboutSection
              id="many-topics"
              heading={aboutContent.manyTopics.heading}
            >
              <p>{aboutContent.manyTopics.intro}</p>

              {aboutContent.manyTopics.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              <ul>
                {aboutContent.manyTopics.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <p>{aboutContent.manyTopics.conclusion}</p>
            </AboutSection>

            {/* Direction Section */}
            <AboutSection
              id="direction"
              heading={aboutContent.direction.heading}
            >
              <p>{aboutContent.direction.intro}</p>

              {aboutContent.direction.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </AboutSection>
          </AboutLayout>
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};
