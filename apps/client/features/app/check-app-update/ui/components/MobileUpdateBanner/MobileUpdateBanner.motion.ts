import type { Target, Transition } from 'motion/react';

export const MOBILE_UPDATE_BANNER_INITIAL: Target = { opacity: 0, y: -8 };

export const MOBILE_UPDATE_BANNER_ANIMATE: Target = { opacity: 1, y: 0 };

export const MOBILE_UPDATE_BANNER_EXIT: Target = { opacity: 0, y: -8 };

export const MOBILE_UPDATE_BANNER_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 34
};
