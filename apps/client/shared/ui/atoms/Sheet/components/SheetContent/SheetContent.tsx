'use client';

import { clsx } from 'clsx';
import { useReducedMotion } from 'motion/react';
import { Dialog as RACDialog } from 'react-aria-components';

import { OverlayCloseButton } from '../../../../molecules/OverlayCloseButton';
import {
  MotionModal,
  REDUCED_MOTION_TRANSITION,
  SHEET_OFFSET,
  SHEET_TRANSITION,
  sideClass,
} from '../../Sheet.config';
import { useSheetAnimation } from '../../sheet-animation-context';

import s from '../../Sheet.module.scss';

import type { SheetContentProps } from '../../Sheet.types';

export const SheetContent = ({
  className,
  modalClassName,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: SheetContentProps) => {
  const animation = useSheetAnimation();
  const shouldReduceMotion = useReducedMotion();

  const offset = SHEET_OFFSET[side];

  const variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { ...offset, opacity: 0 }, visible: { x: 0, y: 0, opacity: 1 } };

  return (
    <MotionModal
      className={clsx(s.modal, sideClass[side], modalClassName)}
      data-slot="sheet-portal"
      variants={variants}
      initial="hidden"
      animate={animation}
      transition={shouldReduceMotion ? REDUCED_MOTION_TRANSITION : SHEET_TRANSITION}
    >
      <RACDialog
        className={clsx('glass-overlay', s.content, className)}
        data-slot="sheet-content"
        {...props}
      >
        {({ close }) => (
          <>
            {children}
            {showCloseButton && <OverlayCloseButton className={s.close} onPress={close} />}
          </>
        )}
      </RACDialog>
    </MotionModal>
  );
};
