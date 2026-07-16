'use client';

import { clsx } from 'clsx';
import { useContext } from 'react';
import { OverlayTriggerStateContext } from 'react-aria-components';

import { Button } from '../../../Button';

import s from '../../Sheet.module.scss';

import type { SheetCloseProps, SheetOverlayProps, SheetPortalProps } from '../../Sheet.types';

export const SheetClose = ({ className, children, ...props }: SheetCloseProps) => {
  const state = useContext(OverlayTriggerStateContext);

  return (
    <Button className={className} data-slot="sheet-close" onPress={() => state?.close()} {...props}>
      {children}
    </Button>
  );
};

export const SheetPortal = ({ children }: SheetPortalProps) => {
  return <>{children}</>;
};

export const SheetOverlay = ({ className, ...props }: SheetOverlayProps) => {
  return <div className={clsx(s.overlay, className)} data-slot="sheet-overlay" {...props} />;
};
