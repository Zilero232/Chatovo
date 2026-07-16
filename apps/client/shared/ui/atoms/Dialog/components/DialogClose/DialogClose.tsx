'use client';

import { clsx } from 'clsx';
import { useContext } from 'react';
import { OverlayTriggerStateContext } from 'react-aria-components';

import { Button } from '../../../Button';

import s from '../../Dialog.module.scss';

import type { DialogCloseProps, DialogOverlayProps, DialogPortalProps } from '../../Dialog.types';

export const DialogClose = ({ className, children, ...props }: DialogCloseProps) => {
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

export const DialogPortal = ({ children }: DialogPortalProps) => {
  return <>{children}</>;
};

export const DialogOverlay = ({ className, ...props }: DialogOverlayProps) => {
  return <div className={clsx(s.overlay, className)} data-slot="dialog-overlay" {...props} />;
};
