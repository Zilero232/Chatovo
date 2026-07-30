import type { Target, Transition } from 'motion/react';

export const FRIEND_ITEM_ANIMATE: Target = { opacity: 1, y: 0 };

export const FRIEND_ITEM_INITIAL: Target = { opacity: 0, y: 8 };

export const FRIEND_ITEM_EXIT: Target = { opacity: 0, scale: 0.95 };

export const FRIEND_ITEM_REDUCED: Target = { opacity: 0 };

export const FRIEND_ITEM_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 460,
  damping: 34
};
