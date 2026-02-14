'use client';

import React from 'react';
import './AboutHero.scss';

interface AboutHeroProps {
  title: string;
  subtitle: string;
}

export const AboutHero = ({ title, subtitle }: AboutHeroProps) => {
  return (
    <section className='about-hero'>
      <div className='about-hero__container'>
        <h1 className='about-hero__title'>{title}</h1>
        <p className='about-hero__subtitle'>{subtitle}</p>
      </div>
    </section>
  );
};
