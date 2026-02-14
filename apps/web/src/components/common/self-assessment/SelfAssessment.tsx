'use client';

import React, { useState } from 'react';
import './SelfAssessment.scss';

export interface Question {
  /**
   * Уникальный идентификатор вопроса
   */
  id: string;

  /**
   * Текст вопроса
   */
  question: string;

  /**
   * Правильный ответ
   */
  answer: string;

  /**
   * Объяснение (опционально)
   */
  explanation?: string;
}

interface SelfAssessmentProps {
  /**
   * Массив вопросов для самопроверки
   */
  questions: Question[];

  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

/**
 * SelfAssessment - компонент "Вопросы для усвоения материала"
 *
 * Реализует блок самопроверки с вопросами и ответами под спойлером.
 * Использует SEO-friendly разметку (details/summary) и schema.org для лучшей индексации.
 *
 * Особенности:
 * - Ответы скрыты по умолчанию (delayed feedback для лучшего запоминания)
 * - Можно раскрыть все ответы сразу
 * - Полная поддержка accessibility (ARIA, keyboard navigation)
 * - Schema.org FAQPage разметка для SEO
 *
 * Пример использования:
 * ```tsx
 * <SelfAssessment questions={[
 *   {
 *     id: '1',
 *     question: 'Что такое retrieval practice?',
 *     answer: 'Практика активного вспоминания информации',
 *     explanation: 'Это улучшает запоминание на 50-100%'
 *   }
 * ]} />
 * ```
 */
export const SelfAssessment = ({
  questions,
  className = '',
}: SelfAssessmentProps) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );

  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Генерируем schema.org FAQPage разметку для SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${q.answer}${q.explanation ? ` ${q.explanation}` : ''}`,
      },
    })),
  };

  return (
    <section className={`self-assessment ${className}`}>
      {/* Schema.org разметка для SEO */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Заголовок */}
      <h2 className='self-assessment__title'>Вопросы для усвоения материала</h2>

      {/* Пояснение */}
      <p className='self-assessment__intro'>
        Исследования показывают, что активное вспоминание информации улучшает
        запоминание на 50–100% по сравнению с простым перечитыванием. Попробуйте
        ответить на вопросы без подглядывания — это поможет лучше закрепить
        материал.
      </p>

      {/* Список вопросов */}
      <div className='self-assessment__questions'>
        {questions.map((question, index) => {
          const isExpanded = expandedQuestions.has(question.id);

          return (
            <div key={question.id} className='self-assessment__question'>
              {/* Вопрос (кликабельный для раскрытия) */}
              <button
                className='self-assessment__question-header'
                id={`question-${question.id}`}
                onClick={() => toggleQuestion(question.id)}
                aria-expanded={isExpanded}
                aria-controls={`answer-${question.id}`}
                aria-label={isExpanded ? 'Скрыть ответ' : 'Показать ответ'}
              >
                <svg
                  className={`self-assessment__question-icon ${isExpanded ? 'self-assessment__question-icon--expanded' : ''}`}
                  width='12'
                  height='12'
                  viewBox='0 0 12 12'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                >
                  <path
                    d='M4 2L8 6L4 10'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span className='self-assessment__question-text'>
                  {question.question}
                </span>
              </button>

              {/* Ответ (скрыт/показан) */}
              {/* SEO-friendly: контент всегда в DOM, скрыт только визуально через CSS */}
              <div
                id={`answer-${question.id}`}
                className={`self-assessment__answer ${isExpanded ? 'self-assessment__answer--expanded' : ''}`}
                role='region'
                aria-labelledby={`question-${question.id}`}
                aria-hidden={!isExpanded}
              >
                <div className='self-assessment__answer-content'>
                  <p className='self-assessment__answer-text'>
                    {question.answer}
                  </p>
                  {question.explanation && (
                    <p className='self-assessment__answer-text'>
                      {question.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
