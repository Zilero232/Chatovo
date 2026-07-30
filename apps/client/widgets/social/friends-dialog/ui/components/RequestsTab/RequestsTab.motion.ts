import type { Target, Transition } from 'motion/react';

export const REQUEST_ITEM_ANIMATE: Target = { opacity: 1, y: 0 };

export const REQUEST_ITEM_INITIAL: Target = { opacity: 0, y: 8 };

export const REQUEST_ITEM_EXIT: Target = { opacity: 0, scale: 0.95 };

export const REQUEST_ITEM_REDUCED: Target = { opacity: 0 };

export const REQUEST_ITEM_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 460,
  damping: 34
};
