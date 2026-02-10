'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Overlay.scss';

interface OverlayProps {
  isVisible: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  zIndex?: number;
}

const Overlay: React.FC<OverlayProps> = ({
  isVisible,
  onClick,
  children,
  zIndex,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className='overlay'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          onClick={onClick}
          style={{ zIndex }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
