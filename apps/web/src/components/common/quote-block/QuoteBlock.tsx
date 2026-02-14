'use client';

import React from 'react';
import './QuoteBlock.scss';

interface QuoteBlockProps {
  title?: string;
  text?: string;
  children?: React.ReactNode;
}

export const QuoteBlock = ({ title, text, children }: QuoteBlockProps) => {
  return (
    <div className='quote-block'>
      {title && <h4 className='quote-block__title'>{title}</h4>}
      {text && <p className='quote-block__text'>{text}</p>}
      {children}
    </div>
  );
};
