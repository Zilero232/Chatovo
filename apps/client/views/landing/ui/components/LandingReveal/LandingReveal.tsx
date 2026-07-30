'use client';

import { motion, useReducedMotion } from 'motion/react';

import type { LandingRevealProps } from './LandingReveal.types';

import {
  LANDING_REVEAL_IN_VIEW,
  LANDING_REVEAL_INITIAL,
  LANDING_REVEAL_REDUCED_INITIAL,
  LANDING_REVEAL_TRANSITION,
  LANDING_REVEAL_VIEWPORT
} from './LandingReveal.motion';

export const LandingReveal = ({
  children,
  className,
  delay = 0,
  as = 'div'
}: LandingRevealProps) => {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={shouldReduceMotion ? LANDING_REVEAL_REDUCED_INITIAL : LANDING_REVEAL_INITIAL}
      transition={{ ...LANDING_REVEAL_TRANSITION, delay: shouldReduceMotion ? 0 : delay }}
      viewport={LANDING_REVEAL_VIEWPORT}
      whileInView={LANDING_REVEAL_IN_VIEW}
    >
      {children}
    </Component>
  );
};
