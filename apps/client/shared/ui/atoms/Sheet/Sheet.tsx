'use client';

import { clsx } from 'clsx';
import { XIcon } from 'lucide-react';
import { Children, type ComponentProps, cloneElement, isValidElement, useContext } from 'react';
import {
  Heading,
  Modal,
  ModalOverlay,
  OverlayTriggerStateContext,
  Dialog as RACDialog,
  DialogTrigger as RACDialogTrigger,
  Text,
} from 'react-aria-components';
import { findChildByType } from '../../lib/overlay-children';
import { Button } from '../Button';
import s from './Sheet.module.scss';
import type { SheetContentProps, SheetProps, SheetSide, SheetTriggerProps } from './Sheet.types';

const sideClass: Record<SheetSide, string> = {
  right: s.sideRight,
  left: s.sideLeft,
  top: s.sideTop,
  bottom: s.sideBottom,
};

const Sheet = ({ open, defaultOpen, onOpenChange, className, children, ...props }: SheetProps) => {
  const triggerChild = findChildByType(children, SheetTrigger);
  const contentChild = findChildByType(children, SheetContent);
  const isControlled = open !== undefined;

  const overlay = (
    <ModalOverlay
      className={clsx(s.overlay, className)}
      data-slot="sheet"
      defaultOpen={defaultOpen}
      isOpen={isControlled ? open : undefined}
      onOpenChange={onOpenChange}
      {...props}
    >
      {contentChild ?? Children.toArray(children).filter((child) => child !== triggerChild)}
    </ModalOverlay>
  );

  if (isControlled || !triggerChild) {
    return overlay;
  }

  return (
    <RACDialogTrigger data-slot="sheet-root" defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {triggerChild}
      {overlay}
    </RACDialogTrigger>
  );
};

const SheetTrigger = ({ asChild, children, className, ...props }: SheetTriggerProps) => {
  if (asChild && isValidElement(children)) {
    const childClassName = (children.props as { className?: string }).className;

    return cloneElement(children, {
      ...props,
      className: clsx(className, childClassName),
      'data-slot': 'sheet-trigger',
    } as Record<string, unknown>);
  }

  return (
    <button className={className} data-slot="sheet-trigger" type="button" {...props}>
      {children}
    </button>
  );
};

const SheetClose = ({ className, children, ...props }: ComponentProps<typeof Button>) => {
  const state = useContext(OverlayTriggerStateContext);

  return (
    <Button className={className} data-slot="sheet-close" onPress={() => state?.close()} {...props}>
      {children}
    </Button>
  );
};

const SheetPortal = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

const SheetOverlay = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={clsx(s.overlay, className)} data-slot="sheet-overlay" {...props} />
);

const SheetContent = ({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: SheetContentProps) => (
  <Modal className={s.modal} data-slot="sheet-portal">
    <RACDialog
      className={clsx('glass-overlay', s.content, sideClass[side], className)}
      data-slot="sheet-content"
      {...props}
    >
      {({ close }) => (
        <>
          {children}
          {showCloseButton && (
            <Button
              aria-label="Close"
              className={s.close}
              size="icon-xs"
              variant="ghost"
              onPress={close}
            >
              <XIcon />
            </Button>
          )}
        </>
      )}
    </RACDialog>
  </Modal>
);

const SheetHeader = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={clsx(s.header, className)} data-slot="sheet-header" {...props} />
);

const SheetFooter = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={clsx(s.footer, className)} data-slot="sheet-footer" {...props} />
);

const SheetTitle = ({ className, children, ...props }: ComponentProps<typeof Heading>) => (
  <Heading className={clsx(s.title, className)} data-slot="sheet-title" slot="title" {...props}>
    {children}
  </Heading>
);

const SheetDescription = ({ className, children, ...props }: ComponentProps<typeof Text>) => (
  <Text
    className={clsx(s.description, className)}
    data-slot="sheet-description"
    slot="description"
    {...props}
  >
    {children}
  </Text>
);

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
