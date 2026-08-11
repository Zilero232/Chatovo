'use client';

import { motion } from 'motion/react';

import type { LandingRevealProps } from './LandingReveal.types';

import {
  LANDING_REVEAL_IN_VIEW,
  LANDING_REVEAL_INITIAL,
  LANDING_REVEAL_TRANSITION,
  LANDING_REVEAL_VIEWPORT
} from './LandingReveal.motion';

export const LandingReveal = ({
  children,
  className,
  delay = 0,
  as = 'div'
}: LandingRevealProps) => {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={LANDING_REVEAL_INITIAL}
      transition={{ ...LANDING_REVEAL_TRANSITION, delay }}
      viewport={LANDING_REVEAL_VIEWPORT}
      whileInView={LANDING_REVEAL_IN_VIEW}
    >
      {children}
    </Component>
  );
};
