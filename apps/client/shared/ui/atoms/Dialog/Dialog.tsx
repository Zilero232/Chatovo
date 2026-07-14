'use client';

import { clsx } from 'clsx';
import { XIcon } from 'lucide-react';
import {
  Children,
  type ComponentProps,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Heading,
  Modal,
  ModalOverlay,
  OverlayTriggerStateContext,
  Dialog as RACDialog,
  DialogTrigger as RACDialogTrigger,
  Text,
} from 'react-aria-components';
import { shouldKeepDialogOpen } from '@/shared/lib/nested-overlay';
import { findChildByType } from '../../lib/overlay-children';
import { Button } from '../Button';
import s from './Dialog.module.scss';
import type { DialogContentProps, DialogProps, DialogTriggerProps } from './Dialog.types';

type DialogOverlayContextValue = {
  setOverlayClassName: (className?: string) => void;
};

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
  const triggerChild = findChildByType(children, DialogTrigger);
  const contentChild = findChildByType(children, DialogContent);
  const isControlled = open !== undefined;

  const overlayProps = {
    className: clsx(s.overlay, overlayClassName, className),
    'data-slot': 'dialog',
    defaultOpen,
    isDismissable: disablePointerDismissal === true ? false : (isDismissable ?? true),
    shouldCloseOnInteractOutside: (element: Element) => !shouldKeepDialogOpen(element),
    onOpenChange,
    ...props,
    ...(isControlled ? { isOpen: open } : {}),
  };

  const overlay = (
    <ModalOverlay {...overlayProps}>
      {contentChild ?? Children.toArray(children).filter((child) => child !== triggerChild)}
    </ModalOverlay>
  );

  const provider = (
    <DialogOverlayContext.Provider value={{ setOverlayClassName }}>
      {isControlled || !triggerChild ? (
        overlay
      ) : (
        <RACDialogTrigger
          data-slot="dialog-root"
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          {triggerChild}
          {overlay}
        </RACDialogTrigger>
      )}
    </DialogOverlayContext.Provider>
  );

  return provider;
};

const DialogTrigger = ({ asChild, children, className, ...props }: DialogTriggerProps) => {
  if (asChild && isValidElement(children)) {
    const childClassName = (children.props as { className?: string }).className;

    return cloneElement(children, {
      ...props,
      className: clsx(className, childClassName),
      'data-slot': 'dialog-trigger',
    } as Record<string, unknown>);
  }

  return (
    <button className={className} data-slot="dialog-trigger" type="button" {...props}>
      {children}
    </button>
  );
};

const DialogPortal = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

const DialogOverlay = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={clsx(s.overlay, className)} data-slot="dialog-overlay" {...props} />
);

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
};

const DialogHeader = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={clsx(s.header, className)} data-slot="dialog-header" {...props} />
);

const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: ComponentProps<'div'> & {
  showCloseButton?: boolean;
}) => {
  const state = useContext(OverlayTriggerStateContext);

  return (
    <div className={clsx(s.footer, className)} data-slot="dialog-footer" {...props}>
      {children}
      {showCloseButton && (
        <Button variant="outline" onPress={() => state?.close()}>
          Close
        </Button>
      )}
    </div>
  );
};

const DialogTitle = ({ className, children, ...props }: ComponentProps<typeof Heading>) => (
  <Heading className={clsx(s.title, className)} data-slot="dialog-title" slot="title" {...props}>
    {children}
  </Heading>
);

const DialogDescription = ({ className, children, ...props }: ComponentProps<typeof Text>) => (
  <Text
    className={clsx(s.description, className)}
    data-slot="dialog-description"
    slot="description"
    {...props}
  >
    {children}
  </Text>
);

const DialogClose = ({ className, children, ...props }: ComponentProps<typeof Button>) => {
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
