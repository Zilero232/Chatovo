import type { Target, Transition } from 'motion/react';

export const LOBBY_SECTION_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 34
};

export const LOBBY_SECTION_ANIMATE: Target = { opacity: 1, y: 0 };

export const LOBBY_SECTION_INITIAL: Target = { opacity: 0, y: 8 };

export const LOBBY_CARD_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 34
};

export const LOBBY_CARD_ANIMATE: Target = { opacity: 1, y: 0, scale: 1 };

export const LOBBY_CARD_INITIAL: Target = { opacity: 0, y: 12, scale: 0.98 };

export const LOBBY_CARD_EXIT: Target = { opacity: 0, scale: 0.96 };

export const LOBBY_CARD_REDUCED: Target = { opacity: 0 };
