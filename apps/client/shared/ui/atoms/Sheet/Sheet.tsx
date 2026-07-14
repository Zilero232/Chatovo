'use client';

import { clsx } from 'clsx';
import { useContext } from 'react';
import {
  Heading,
  Modal,
  OverlayTriggerStateContext,
  Dialog as RACDialog,
  DialogTrigger as RACDialogTrigger,
  Text,
} from 'react-aria-components';

import { wrapOverlayContent } from '../../lib/wrap-overlay-content';
import { OverlayCloseButton } from '../../molecules/OverlayCloseButton';
import { Button } from '../Button';

import s from './Sheet.module.scss';

import type {
  SheetCloseProps,
  SheetContentProps,
  SheetDescriptionProps,
  SheetFooterProps,
  SheetHeaderProps,
  SheetModalOverlayProps,
  SheetOverlayProps,
  SheetPortalProps,
  SheetProps,
  SheetSide,
  SheetTitleProps,
  SheetTriggerProps,
} from './Sheet.types';

const sideClass: Record<SheetSide, string> = {
  right: s.sideRight,
  left: s.sideLeft,
  top: s.sideTop,
  bottom: s.sideBottom,
};

const Sheet = ({ open, defaultOpen, onOpenChange, className, children, ...props }: SheetProps) => {
  const isControlled = open !== undefined;

  const overlayProps = {
    className: clsx(s.overlay, className),
    ...props,
  } as SheetModalOverlayProps;

  return (
    <RACDialogTrigger
      data-slot="sheet-root"
      defaultOpen={defaultOpen}
      isOpen={isControlled ? open : undefined}
      onOpenChange={onOpenChange}
    >
      {wrapOverlayContent({
        children,
        contentComponent: SheetContent,
        overlayProps,
        dataSlot: 'sheet',
      })}
    </RACDialogTrigger>
  );
};

const SheetTrigger = ({ className, ...props }: SheetTriggerProps) => {
  return <Button className={className} data-slot="sheet-trigger" {...props} />;
};

const SheetClose = ({ className, children, ...props }: SheetCloseProps) => {
  const state = useContext(OverlayTriggerStateContext);

  return (
    <Button className={className} data-slot="sheet-close" onPress={() => state?.close()} {...props}>
      {children}
    </Button>
  );
};

const SheetPortal = ({ children }: SheetPortalProps) => {
  return <>{children}</>;
};

const SheetOverlay = ({ className, ...props }: SheetOverlayProps) => {
  return <div className={clsx(s.overlay, className)} data-slot="sheet-overlay" {...props} />;
};

const SheetContent = ({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: SheetContentProps) => {
  return (
    <Modal className={s.modal} data-slot="sheet-portal">
      <RACDialog
        className={clsx('glass-overlay', s.content, sideClass[side], className)}
        data-slot="sheet-content"
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

const SheetHeader = ({ className, ...props }: SheetHeaderProps) => {
  return <div className={clsx(s.header, className)} data-slot="sheet-header" {...props} />;
};

const SheetFooter = ({ className, ...props }: SheetFooterProps) => {
  return <div className={clsx(s.footer, className)} data-slot="sheet-footer" {...props} />;
};

const SheetTitle = ({ className, children, ...props }: SheetTitleProps) => {
  return (
    <Heading className={clsx(s.title, className)} data-slot="sheet-title" slot="title" {...props}>
      {children}
    </Heading>
  );
};

const SheetDescription = ({ className, children, ...props }: SheetDescriptionProps) => {
  return (
    <Text
      className={clsx(s.description, className)}
      data-slot="sheet-description"
      slot="description"
      {...props}
    >
      {children}
    </Text>
  );
};

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
