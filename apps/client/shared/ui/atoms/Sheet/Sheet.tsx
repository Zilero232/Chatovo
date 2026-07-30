'use client';

import { Dialog } from '@base-ui-components/react/dialog';
import { clsx } from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

import { shouldKeepDialogOpen } from '@/shared/lib/nested-overlay';

import type {
  SheetContentProps,
  SheetDescriptionProps,
  SheetProps,
  SheetTitleProps
} from './Sheet.types';

import {
  OVERLAY_TRANSITION,
  SHEET_REDUCED_TRANSITION,
  SHEET_TRANSITION,
  sheetVariants,
  sideClass
} from './Sheet.motion';

import s from './Sheet.module.scss';

export const Sheet = ({
  open,
  defaultOpen,
  onOpenChange,
  className,
  trigger,
  children,
  ...props
}: SheetProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const isOpen = open ?? uncontrolledOpen;

  const handleOpenChange = (next: boolean, eventDetails: Dialog.Root.ChangeEventDetails) => {
    const isOutsidePress = eventDetails.reason === 'outside-press';

    if (!next && isOutsidePress && shouldKeepDialogOpen(eventDetails.event?.target ?? null)) {
      eventDetails.cancel();

      return;
    }

    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Dialog.Root defaultOpen={defaultOpen} open={open} onOpenChange={handleOpenChange} {...props}>
      {trigger ? <Dialog.Trigger render={trigger as never} /> : null}

      <Dialog.Portal keepMounted>
        <AnimatePresence>
          {isOpen ? (
            <Dialog.Backdrop
              key='sheet-backdrop'
              render={
                <motion.div
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={OVERLAY_TRANSITION}
                />
              }
              className={clsx(s.overlay, className)}
              data-slot='sheet'
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>{isOpen ? children : null}</AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const SheetContent = ({
  className,
  modalClassName,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: SheetContentProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Dialog.Popup
      key='sheet-popup'
      render={
        <motion.div
          animate={shouldReduceMotion ? { opacity: 1 } : 'visible'}
          exit={shouldReduceMotion ? { opacity: 0 } : 'hidden'}
          initial={shouldReduceMotion ? { opacity: 0 } : 'hidden'}
          transition={shouldReduceMotion ? SHEET_REDUCED_TRANSITION : SHEET_TRANSITION}
          variants={sheetVariants(side)}
        />
      }
      className={clsx(s.modal, sideClass[side], modalClassName)}
      data-slot='sheet-portal'
      {...props}
    >
      <div className={clsx('glass-overlay', s.content, className)} data-slot='sheet-content'>
        {children}
        {showCloseButton && (
          <Dialog.Close className={s.close} data-slot='sheet-close'>
            <span aria-hidden>×</span>
          </Dialog.Close>
        )}
      </div>
    </Dialog.Popup>
  );
};

export const SheetTitle = ({ className, children, ...props }: SheetTitleProps) => (
  <Dialog.Title className={clsx(s.title, className)} data-slot='sheet-title' {...props}>
    {children}
  </Dialog.Title>
);

export const SheetDescription = ({ className, children, ...props }: SheetDescriptionProps) => (
  <Dialog.Description
    className={clsx(s.description, className)}
    data-slot='sheet-description'
    {...props}
  >
    {children}
  </Dialog.Description>
);
