import { motion } from 'motion/react';
import { Modal, ModalOverlay } from 'react-aria-components';

import s from './Sheet.module.scss';

import type { SheetSide } from './Sheet.types';

export const MotionModalOverlay = motion.create(ModalOverlay);
export const MotionModal = motion.create(Modal);

export const OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const OVERLAY_TRANSITION = { duration: 0.2, ease: 'easeOut' } as const;

export const SHEET_OFFSET: Record<SheetSide, { x?: string; y?: string }> = {
  right: { x: '100%' },
  left: { x: '-100%' },
  top: { y: '-100%' },
  bottom: { y: '100%' },
};

export const SHEET_TRANSITION = { type: 'spring', stiffness: 380, damping: 40 } as const;

export const REDUCED_MOTION_TRANSITION = { duration: 0.15 } as const;

export const sideClass: Record<SheetSide, string> = {
  right: s.sideRight,
  left: s.sideLeft,
  top: s.sideTop,
  bottom: s.sideBottom,
};
