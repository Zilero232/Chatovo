'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import { ModalOverlay, DialogTrigger as RACDialogTrigger } from 'react-aria-components';

import { shouldKeepDialogOpen } from '@/shared/lib/nested-overlay';
import { DialogOverlayContext } from '../../dialog-overlay-context';

import s from '../../Dialog.module.scss';

import type { DialogModalOverlayProps, DialogProps } from '../../Dialog.types';

export const Dialog = ({
  open,
  defaultOpen,
  onOpenChange,
  disablePointerDismissal,
  isDismissable,
  className,
  trigger,
  children,
  ...props
}: DialogProps) => {
  const [overlayClassName, setOverlayClassName] = useState<string>();
  const isControlled = open !== undefined;

  const overlayProps = {
    className: clsx(s.overlay, overlayClassName, className),
    isDismissable: disablePointerDismissal === true ? false : (isDismissable ?? true),
    shouldCloseOnInteractOutside: (element: Element) => {
      return !shouldKeepDialogOpen(element);
    },
    ...props,
  } as DialogModalOverlayProps;

  return (
    <DialogOverlayContext.Provider value={{ setOverlayClassName }}>
      {trigger ? (
        <RACDialogTrigger
          data-slot="dialog-root"
          defaultOpen={defaultOpen}
          isOpen={isControlled ? open : undefined}
          onOpenChange={onOpenChange}
        >
          {trigger}
          <ModalOverlay {...overlayProps} data-slot="dialog">
            {children}
          </ModalOverlay>
        </RACDialogTrigger>
      ) : (
        <ModalOverlay
          {...overlayProps}
          data-slot="dialog"
          defaultOpen={defaultOpen}
          isOpen={isControlled ? open : undefined}
          onOpenChange={onOpenChange}
        >
          {children}
        </ModalOverlay>
      )}
    </DialogOverlayContext.Provider>
  );
};
