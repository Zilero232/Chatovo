import s from './Sheet.module.scss';

import type { Transition, Variants } from 'motion/react';
import type { SheetSide } from './Sheet.types';

export const sideClass: Record<SheetSide, string> = {
  right: s.sideRight,
  left: s.sideLeft,
  top: s.sideTop,
  bottom: s.sideBottom,
};

const offscreen: Record<SheetSide, { x?: string; y?: string }> = {
  right: { x: '100%' },
  left: { x: '-100%' },
  top: { y: '-100%' },
  bottom: { y: '100%' },
};

export const sheetVariants = (side: SheetSide): Variants => ({
  hidden: offscreen[side],
  visible: { x: 0, y: 0 },
});

export const SHEET_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 40,
  mass: 0.9,
};

export const SHEET_REDUCED_TRANSITION: Transition = { duration: 0.15, ease: 'easeOut' };

export const OVERLAY_TRANSITION: Transition = { duration: 0.2, ease: 'easeOut' };
