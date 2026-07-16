'use client';

import { clsx } from 'clsx';
import { useEffect } from 'react';
import { Modal, Dialog as RACDialog } from 'react-aria-components';

import { OverlayCloseButton } from '../../../../molecules/OverlayCloseButton';
import { useDialogOverlay } from '../../dialog-overlay-context';

import s from '../../Dialog.module.scss';

import type { DialogContentProps } from '../../Dialog.types';

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
