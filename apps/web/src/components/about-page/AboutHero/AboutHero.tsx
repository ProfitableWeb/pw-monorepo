'use client';

import { motion } from 'framer-motion';
import './AboutHero.scss';

interface AboutHeroProps {
  title: string;
  subtitle: string;
}

export const AboutHero: React.FC<AboutHeroProps> = ({ title, subtitle }) => {
  return (
    <section className="about-hero">
      <div className="about-hero__container">
        <motion.h1
          className="about-hero__title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="about-hero__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
};
