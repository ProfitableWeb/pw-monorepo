'use client';

import React from 'react';
import './AboutSection.scss';

interface AboutSectionProps {
  id?: string;
  heading?: string;
  children: React.ReactNode;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  id,
  heading,
  children,
}) => {
  return (
    <section id={id} className='about-section'>
      {heading && <h2 className='about-section__heading'>{heading}</h2>}
      <div className='about-section__content'>{children}</div>
    </section>
  );
};
