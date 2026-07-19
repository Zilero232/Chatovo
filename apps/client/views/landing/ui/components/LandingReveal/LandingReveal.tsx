'use client';

import { motion, useReducedMotion } from 'motion/react';

import type { LandingRevealProps } from './LandingReveal.types';

export const LandingReveal = ({
  children,
  className,
  delay = 0,
  as = 'div',
}: LandingRevealProps) => {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -80px 0px' }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 30,
        delay: shouldReduceMotion ? 0 : delay,
      }}
    >
      {children}
    </Component>
  );
};
