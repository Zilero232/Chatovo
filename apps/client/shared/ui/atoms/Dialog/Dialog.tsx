'use client';

import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { shouldKeepDialogOpen } from '@/shared/lib/nested-overlay';
import { OverlayCloseButton } from '../../molecules/OverlayCloseButton';
import { Button } from '../Button';
import { DialogOverlayContext, useDialogOverlay } from './dialog-overlay-context';

import s from './Dialog.module.scss';

import type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogProps,
  DialogTitleProps,
} from './Dialog.types';

export const Dialog = ({
  open,
  defaultOpen,
  onOpenChange,
  disablePointerDismissal,
  className,
  trigger,
  children,
  ...props
}: DialogProps) => {
  const [overlayClassName, setOverlayClassName] = useState<string>();

  const handleOpenChange = (next: boolean, eventDetails: BaseDialog.Root.ChangeEventDetails) => {
    const isOutsidePress = eventDetails.reason === 'outside-press';

    if (!next && isOutsidePress && shouldKeepDialogOpen(eventDetails.event?.target ?? null)) {
      eventDetails.cancel();

      return;
    }

    onOpenChange?.(next);
  };

  return (
    <DialogOverlayContext.Provider value={{ setOverlayClassName }}>
      <BaseDialog.Root
        defaultOpen={defaultOpen}
        disablePointerDismissal={disablePointerDismissal}
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {trigger ? <BaseDialog.Trigger render={trigger as never} /> : null}

        <BaseDialog.Portal>
          <BaseDialog.Backdrop
            className={clsx(s.overlay, overlayClassName, className)}
            data-slot="dialog"
          />
          {children}
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </DialogOverlayContext.Provider>
  );
};

export const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  overlayClassName,
  ...props
}: DialogContentProps) => {
  const overlayContext = useDialogOverlay();

  useEffect(() => {
    overlayContext?.setOverlayClassName(overlayClassName);

    return () => {
      overlayContext?.setOverlayClassName(undefined);
    };
  }, [overlayClassName, overlayContext]);

  return (
    <BaseDialog.Popup className={s.modal} data-slot="dialog-portal" {...props}>
      <div
        className={clsx('glass-overlay', 'max-h-dvh-safe', s.content, className)}
        data-slot="dialog-content"
      >
        {children}
        {showCloseButton && (
          <BaseDialog.Close render={<OverlayCloseButton className={s.close} />} />
        )}
      </div>
    </BaseDialog.Popup>
  );
};

export const DialogClose = ({ className, children, ...props }: DialogCloseProps) => {
  return (
    <BaseDialog.Close data-slot="dialog-close" render={<Button className={className} {...props} />}>
      {children}
    </BaseDialog.Close>
  );
};

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  return <div className={clsx(s.header, className)} data-slot="dialog-header" {...props} />;
};

export const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: DialogFooterProps) => {
  const t = useTranslations('common');

  return (
    <div className={clsx(s.footer, className)} data-slot="dialog-footer" {...props}>
      {children}
      {showCloseButton && (
        <BaseDialog.Close render={<Button variant="outline" />}>{t('close')}</BaseDialog.Close>
      )}
    </div>
  );
};

export const DialogTitle = ({ className, children, ...props }: DialogTitleProps) => {
  return (
    <BaseDialog.Title className={clsx(s.title, className)} data-slot="dialog-title" {...props}>
      {children}
    </BaseDialog.Title>
  );
};

export const DialogDescription = ({ className, children, ...props }: DialogDescriptionProps) => {
  return (
    <BaseDialog.Description
      className={clsx(s.description, className)}
      data-slot="dialog-description"
      {...props}
    >
      {children}
    </BaseDialog.Description>
  );
};
