'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SocialIcons from '@/components/common/social-icons';
import {
  SOCIAL_LINKS_AUTHOR,
  buildSocialLinks,
} from '@/components/common/social-icons';
import { AUTHOR_FALLBACK } from '@/config/author';
import type { AuthorProfile } from '@/lib/api-client';
import {
  containerVariants,
  itemVariants,
} from '@/components/app-layout/app-category-page/category-page-header/CategoryPageHeader.animations';
import './AuthorPageHeader.scss';

interface AuthorPageHeaderProps {
  author: AuthorProfile | null;
}

/**
 * Шапка страницы автора (аналог CategoryPageHeader)
 */
const AuthorPageHeader = ({ author }: AuthorPageHeaderProps) => {
  const name = author?.name ?? AUTHOR_FALLBACK.name;
  const jobTitle = author?.jobTitle ?? AUTHOR_FALLBACK.jobTitle;
  const avatar = author?.avatar ?? AUTHOR_FALLBACK.avatar;
  const socialLinks = author?.socialLinks
    ? buildSocialLinks(author.socialLinks)
    : SOCIAL_LINKS_AUTHOR;

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
              src={avatar}
              alt={name}
              className='author-page-header__avatar'
            />
          </motion.div>

          <div className='author-page-header__info'>
            <motion.h1
              className='author-page-header__title'
              variants={itemVariants}
            >
              {name}
            </motion.h1>
            <motion.p
              className='author-page-header__subtitle'
              variants={itemVariants}
            >
              {jobTitle}
            </motion.p>
            <motion.div
              className='author-page-header__socials'
              variants={itemVariants}
            >
              <SocialIcons size='lg' links={socialLinks} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AuthorPageHeader;
