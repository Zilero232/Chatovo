'use client';

import { Dialog } from '@base-ui-components/react/dialog';
import { clsx } from 'clsx';

import { shouldKeepDialogOpen } from '@/shared/lib/nested-overlay';
import { sideClass } from './Sheet.config';

import s from './Sheet.module.scss';

import type {
  SheetContentProps,
  SheetDescriptionProps,
  SheetProps,
  SheetTitleProps,
} from './Sheet.types';

export const Sheet = ({
  open,
  defaultOpen,
  onOpenChange,
  className,
  trigger,
  children,
  ...props
}: SheetProps) => {
  const handleOpenChange = (next: boolean, eventDetails: Dialog.Root.ChangeEventDetails) => {
    const isOutsidePress = eventDetails.reason === 'outside-press';

    if (!next && isOutsidePress && shouldKeepDialogOpen(eventDetails.event?.target ?? null)) {
      eventDetails.cancel();

      return;
    }

    onOpenChange?.(next);
  };

  return (
    <Dialog.Root defaultOpen={defaultOpen} open={open} onOpenChange={handleOpenChange} {...props}>
      {trigger ? <Dialog.Trigger render={trigger as never} /> : null}

      <Dialog.Portal>
        <Dialog.Backdrop className={clsx(s.overlay, className)} data-slot="sheet" />
        {children}
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
  return (
    <Dialog.Popup
      className={clsx(s.modal, sideClass[side], modalClassName)}
      data-slot="sheet-portal"
      {...props}
    >
      <div className={clsx('glass-overlay', s.content, className)} data-slot="sheet-content">
        {children}
        {showCloseButton && (
          <Dialog.Close className={s.close} data-slot="sheet-close">
            <span aria-hidden>×</span>
          </Dialog.Close>
        )}
      </div>
    </Dialog.Popup>
  );
};

export const SheetTitle = ({ className, children, ...props }: SheetTitleProps) => {
  return (
    <Dialog.Title className={clsx(s.title, className)} data-slot="sheet-title" {...props}>
      {children}
    </Dialog.Title>
  );
};

export const SheetDescription = ({ className, children, ...props }: SheetDescriptionProps) => {
  return (
    <Dialog.Description
      className={clsx(s.description, className)}
      data-slot="sheet-description"
      {...props}
    >
      {children}
    </Dialog.Description>
  );
};
