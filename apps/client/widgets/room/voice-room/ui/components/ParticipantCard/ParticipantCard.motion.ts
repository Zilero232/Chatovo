import type { Target, Transition } from 'motion/react';

export const PARTICIPANT_CARD_ANIMATE: Target = { opacity: 1, scale: 1 };

export const PARTICIPANT_CARD_HIDDEN: Target = { opacity: 0, scale: 0.92 };

export const PARTICIPANT_CARD_REDUCED_HIDDEN: Target = { opacity: 0 };

export const PARTICIPANT_CARD_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 32
};
