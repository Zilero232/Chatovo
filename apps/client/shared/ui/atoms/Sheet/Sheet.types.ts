import type { ComponentProps, ReactNode } from 'react';
import type {
  Heading,
  ModalOverlay,
  ModalOverlayProps,
  DialogProps as RACDialogProps,
  Text,
} from 'react-aria-components';
import type { ButtonProps } from '../Button';

export type SheetProps = Omit<ModalOverlayProps, 'children'> & {
  open?: boolean;
  trigger?: ReactNode;
  children?: ReactNode;
};

export type SheetContentProps = Omit<RACDialogProps, 'children'> & {
  side?: SheetSide;
  showCloseButton?: boolean;
  children?: ReactNode;
};

export type SheetSide = 'bottom' | 'left' | 'right' | 'top';

export type SheetCloseProps = ButtonProps;

export type SheetPortalProps = {
  children?: ReactNode;
};

export type SheetOverlayProps = ComponentProps<'div'>;

export type SheetHeaderProps = ComponentProps<'div'>;

export type SheetFooterProps = ComponentProps<'div'>;

export type SheetTitleProps = ComponentProps<typeof Heading>;

export type SheetDescriptionProps = ComponentProps<typeof Text>;

export type SheetModalOverlayProps = ComponentProps<typeof ModalOverlay>;
