'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  Heading,
  Modal,
  OverlayTriggerStateContext,
  Dialog as RACDialog,
  DialogTrigger as RACDialogTrigger,
  Text,
} from 'react-aria-components';

import { shouldKeepDialogOpen } from '@/shared/lib/nested-overlay';
import { wrapOverlayContent } from '../../lib/wrap-overlay-content';
import { OverlayCloseButton } from '../../molecules/OverlayCloseButton';
import { Button } from '../Button';

import s from './Dialog.module.scss';

import type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogModalOverlayProps,
  DialogOverlayContextValue,
  DialogOverlayProps,
  DialogPortalProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
} from './Dialog.types';

const DialogOverlayContext = createContext<DialogOverlayContextValue | null>(null);

const Dialog = ({
  open,
  defaultOpen,
  onOpenChange,
  disablePointerDismissal,
  isDismissable,
  className,
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
      <RACDialogTrigger
        data-slot="dialog-root"
        defaultOpen={defaultOpen}
        isOpen={isControlled ? open : undefined}
        onOpenChange={onOpenChange}
      >
        {wrapOverlayContent({
          children,
          contentComponent: DialogContent,
          overlayProps,
          dataSlot: 'dialog',
        })}
      </RACDialogTrigger>
    </DialogOverlayContext.Provider>
  );
};

const DialogTrigger = ({ className, ...props }: DialogTriggerProps) => {
  return <Button className={className} data-slot="dialog-trigger" {...props} />;
};

const DialogPortal = ({ children }: DialogPortalProps) => {
  return <>{children}</>;
};

const DialogOverlay = ({ className, ...props }: DialogOverlayProps) => {
  return <div className={clsx(s.overlay, className)} data-slot="dialog-overlay" {...props} />;
};

const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  overlayClassName,
  ...props
}: DialogContentProps) => {
  const overlayContext = useContext(DialogOverlayContext);

  useEffect(() => {
    overlayContext?.setOverlayClassName(overlayClassName);

    return () => {
      overlayContext?.setOverlayClassName(undefined);
    };
  }, [overlayClassName, overlayContext]);

  return (
    <Modal className={s.modal} data-slot="dialog-portal">
      <RACDialog
        className={clsx('glass-overlay', 'max-h-dvh-safe', s.content, className)}
        data-slot="dialog-content"
        {...props}
      >
        {({ close }) => (
          <>
            {children}
            {showCloseButton && <OverlayCloseButton className={s.close} onPress={close} />}
          </>
        )}
      </RACDialog>
    </Modal>
  );
};

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  return <div className={clsx(s.header, className)} data-slot="dialog-header" {...props} />;
};

const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: DialogFooterProps) => {
  const t = useTranslations('common');
  const state = useContext(OverlayTriggerStateContext);

  return (
    <div className={clsx(s.footer, className)} data-slot="dialog-footer" {...props}>
      {children}
      {showCloseButton && (
        <Button variant="outline" onPress={() => state?.close()}>
          {t('close')}
        </Button>
      )}
    </div>
  );
};

const DialogTitle = ({ className, children, ...props }: DialogTitleProps) => {
  return (
    <Heading className={clsx(s.title, className)} data-slot="dialog-title" slot="title" {...props}>
      {children}
    </Heading>
  );
};

const DialogDescription = ({ className, children, ...props }: DialogDescriptionProps) => {
  return (
    <Text
      className={clsx(s.description, className)}
      data-slot="dialog-description"
      slot="description"
      {...props}
    >
      {children}
    </Text>
  );
};

const DialogClose = ({ className, children, ...props }: DialogCloseProps) => {
  const state = useContext(OverlayTriggerStateContext);

  return (
    <Button
      className={className}
      data-slot="dialog-close"
      onPress={() => state?.close()}
      {...props}
    >
      {children}
    </Button>
  );
};

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
