import type { ComponentProps, ReactNode } from 'react';
import type { ModalOverlayProps, DialogProps as RACDialogProps } from 'react-aria-components';

export type DialogProps = Omit<ModalOverlayProps, 'children'> & {
  open?: boolean;
  disablePointerDismissal?: boolean;
  children?: ReactNode;
};

export type DialogContentProps = Omit<RACDialogProps, 'children'> & {
  showCloseButton?: boolean;
  overlayClassName?: string;
  children?: ReactNode;
};

export type DialogTriggerProps = ComponentProps<'button'> & {
  asChild?: boolean;
};
