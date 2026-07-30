import type { Target, Transition } from 'motion/react';

export const HERO_VISUAL_ANIMATE: Target = { opacity: 1, scale: 1, y: 0 };

export const HERO_VISUAL_INITIAL: Target = { opacity: 0, scale: 0.96, y: 16 };

export const HERO_VISUAL_REDUCED_INITIAL: Target = { opacity: 0 };

export const HERO_VISUAL_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 28,
  delay: 0.15
};

export const HERO_SPEAKER_PULSE: Target = { scale: [1, 1.07, 1] };

export const HERO_SPEAKER_TRANSITION: Transition = {
  duration: 2.4,
  repeat: Number.POSITIVE_INFINITY,
  ease: 'easeInOut'
};
