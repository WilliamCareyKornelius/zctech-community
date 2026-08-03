'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
  delay?: number;
}

export function FadeIn({ children, className, direction = 'up', delay = 0 }: FadeInProps) {
  const x = direction === 'left' ? -20 : direction === 'right' ? 20 : 0;
  const y = direction === 'up' ? 20 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
