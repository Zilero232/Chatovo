import type { ComponentProps, ReactNode } from 'react';
import type {
  Heading,
  ModalOverlay,
  ModalOverlayProps,
  DialogProps as RACDialogProps,
  Text,
} from 'react-aria-components';
import type { ButtonProps } from '../Button';

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

export type DialogTriggerProps = ButtonProps;

export type DialogPortalProps = {
  children?: ReactNode;
};

export type DialogOverlayProps = ComponentProps<'div'>;

export type DialogHeaderProps = ComponentProps<'div'>;

export type DialogFooterProps = ComponentProps<'div'> & {
  showCloseButton?: boolean;
};

export type DialogTitleProps = ComponentProps<typeof Heading>;

export type DialogDescriptionProps = ComponentProps<typeof Text>;

export type DialogCloseProps = ButtonProps;

export type DialogOverlayContextValue = {
  setOverlayClassName: (className?: string) => void;
};

export type DialogModalOverlayProps = ComponentProps<typeof ModalOverlay>;
