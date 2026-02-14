'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SocialIcons from '@/components/common/social-icons';
import { SOCIAL_LINKS_AUTHOR } from '@/components/common/social-icons';
import { AUTHOR_DATA } from '@/config/author';
import {
  containerVariants,
  itemVariants,
} from '@/components/app-layout/app-category-page/category-page-header/CategoryPageHeader.animations';
import './AuthorPageHeader.scss';

/**
 * Шапка страницы автора (аналог CategoryPageHeader)
 */
const AuthorPageHeader = () => {
  return (
    <motion.section
      className='author-page-header'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <div className='author-page-header__container'>
        <div className='author-page-header__content'>
          <motion.div
            className='author-page-header__avatar-wrapper'
            variants={itemVariants}
          >
            <img
              src={AUTHOR_DATA.avatar}
              alt={AUTHOR_DATA.name}
              className='author-page-header__avatar'
            />
          </motion.div>

          <div className='author-page-header__info'>
            <motion.h1
              className='author-page-header__title'
              variants={itemVariants}
            >
              {AUTHOR_DATA.name}
            </motion.h1>
            <motion.p
              className='author-page-header__subtitle'
              variants={itemVariants}
            >
              {AUTHOR_DATA.jobTitle}
            </motion.p>
            <motion.div
              className='author-page-header__socials'
              variants={itemVariants}
            >
              <SocialIcons size='lg' links={SOCIAL_LINKS_AUTHOR} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AuthorPageHeader;
