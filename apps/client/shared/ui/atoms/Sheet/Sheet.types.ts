import type { ComponentProps, ReactNode } from 'react';
import type { ModalOverlayProps, DialogProps as RACDialogProps } from 'react-aria-components';

export type SheetProps = Omit<ModalOverlayProps, 'children'> & {
  open?: boolean;
  children?: ReactNode;
};

export type SheetTriggerProps = ComponentProps<'button'> & {
  asChild?: boolean;
};

export type SheetContentProps = Omit<RACDialogProps, 'children'> & {
  side?: 'bottom' | 'left' | 'right' | 'top';
  showCloseButton?: boolean;
  children?: ReactNode;
};

export type SheetSide = NonNullable<SheetContentProps['side']>;
