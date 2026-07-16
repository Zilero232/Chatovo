'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import { DialogTrigger as RACDialogTrigger } from 'react-aria-components';

import { shouldKeepDialogOpen } from '@/shared/lib/nested-overlay';
import { MotionModalOverlay, OVERLAY_TRANSITION, OVERLAY_VARIANTS } from '../../Sheet.config';
import { SheetAnimationContext } from '../../sheet-animation-context';

import s from '../../Sheet.module.scss';

import type { SheetAnimationState, SheetMotionOverlayProps, SheetProps } from '../../Sheet.types';

export const Sheet = ({
  open,
  defaultOpen,
  onOpenChange,
  isDismissable,
  className,
  trigger,
  children,
  ...props
}: SheetProps) => {
  const [animation, setAnimation] = useState<SheetAnimationState>(
    open || defaultOpen ? 'visible' : 'unmounted',
  );

  const isControlled = open !== undefined;

  const handleOpenChange = (next: boolean) => {
    setAnimation(next ? 'visible' : 'hidden');
    onOpenChange?.(next);
  };

  const overlayProps = {
    className: clsx(s.overlay, className),
    isDismissable: isDismissable ?? true,
    shouldCloseOnInteractOutside: (element: Element) => !shouldKeepDialogOpen(element),
    isExiting: animation === 'hidden',
    variants: OVERLAY_VARIANTS,
    initial: 'hidden',
    animate: animation,
    transition: OVERLAY_TRANSITION,
    onAnimationComplete: (current: unknown) => {
      setAnimation((prev) => (current === 'hidden' && prev === 'hidden' ? 'unmounted' : prev));
    },
    ...props,
  } as SheetMotionOverlayProps;

  return (
    <SheetAnimationContext.Provider value={animation}>
      {trigger ? (
        <RACDialogTrigger
          data-slot="sheet-root"
          defaultOpen={defaultOpen}
          isOpen={isControlled ? open : undefined}
          onOpenChange={handleOpenChange}
        >
          {trigger}
          <MotionModalOverlay {...overlayProps} data-slot="sheet">
            {children}
          </MotionModalOverlay>
        </RACDialogTrigger>
      ) : (
        <MotionModalOverlay
          {...overlayProps}
          data-slot="sheet"
          defaultOpen={defaultOpen}
          isOpen={isControlled ? open : undefined}
          onOpenChange={handleOpenChange}
        >
          {children}
        </MotionModalOverlay>
      )}
    </SheetAnimationContext.Provider>
  );
};
