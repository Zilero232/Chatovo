'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { clsx } from 'clsx';
import { Lightbulb } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import type {
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogHintProps,
  DialogProps,
  DialogTitleProps
} from './Dialog.types';

import { OverlayCloseButton } from '../../components/OverlayCloseButton';
import { Button } from '../Button';
import { DialogOverlayProvider, useDialogOverlay } from './dialog-overlay-context';

import s from './Dialog.module.scss';

const DialogBackdrop = ({ className }: { className?: string }) => {
  const overlay = useDialogOverlay();

  return (
    <BaseDialog.Backdrop
      className={clsx(s.overlay, overlay?.overlayClassName, className)}
      data-slot='dialog'
    />
  );
};

export const Dialog = ({
  open,
  defaultOpen,
  onOpenChange,
  disablePointerDismissal,
  className,
  trigger,
  children,
  ...props
}: DialogProps) => (
  <DialogOverlayProvider>
    <BaseDialog.Root
      defaultOpen={defaultOpen}
      disablePointerDismissal={disablePointerDismissal}
      open={open}
      onOpenChange={onOpenChange}
      {...props}
    >
      {trigger ? <BaseDialog.Trigger render={trigger as never} /> : null}

      <BaseDialog.Portal>
        <DialogBackdrop className={className} />
        {children}
      </BaseDialog.Portal>
    </BaseDialog.Root>
  </DialogOverlayProvider>
);

export const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  overlayClassName,
  popupClassName,
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
    <BaseDialog.Popup
      className={clsx(s.modal, popupClassName)}
      data-slot='dialog-portal'
      {...props}
    >
      <div
        className={clsx('glass-overlay', 'max-h-dvh-safe', s.content, className)}
        data-slot='dialog-content'
      >
        {children}
        {showCloseButton && (
          <BaseDialog.Close render={<OverlayCloseButton className={s.close} />} />
        )}
      </div>
    </BaseDialog.Popup>
  );
};

export const DialogHeader = ({
  className,
  icon,
  tone = 'violet',
  children,
  ...props
}: DialogHeaderProps) => (
  <div
    className={clsx(s.header, icon && s.headerWithIcon, className)}
    data-slot='dialog-header'
    {...props}
  >
    {icon && (
      <span aria-hidden className={s.headerIcon} data-tone={tone}>
        {icon}
      </span>
    )}
    <div className={s.headerText}>{children}</div>
  </div>
);

export const DialogHint = ({ className, icon, children, ...props }: DialogHintProps) => (
  <div className={clsx(s.hint, className)} data-slot='dialog-hint' {...props}>
    <span aria-hidden className={s.hintIcon}>
      {icon ?? <Lightbulb />}
    </span>
    <span className={s.hintText}>{children}</span>
  </div>
);

export const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: DialogFooterProps) => {
  const t = useTranslations('common');

  return (
    <div className={clsx(s.footer, className)} data-slot='dialog-footer' {...props}>
      {children}
      {showCloseButton && (
        <BaseDialog.Close render={<Button variant='outline' />}>{t('close')}</BaseDialog.Close>
      )}
    </div>
  );
};

export const DialogTitle = ({ className, children, ...props }: DialogTitleProps) => (
  <BaseDialog.Title className={clsx(s.title, className)} data-slot='dialog-title' {...props}>
    {children}
  </BaseDialog.Title>
);

export const DialogDescription = ({ className, children, ...props }: DialogDescriptionProps) => (
  <BaseDialog.Description
    className={clsx(s.description, className)}
    data-slot='dialog-description'
    {...props}
  >
    {children}
  </BaseDialog.Description>
);
