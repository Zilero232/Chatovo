import type { Dialog } from '@base-ui-components/react/dialog';
import type { ComponentProps, ReactNode } from 'react';
import type { ButtonProps } from '../Button';

export type DialogProps = Omit<ComponentProps<typeof Dialog.Root>, 'children' | 'onOpenChange'> & {
  className?: string;
  trigger?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

export type DialogContentProps = Omit<ComponentProps<typeof Dialog.Popup>, 'className'> & {
  className?: string;
  showCloseButton?: boolean;
  overlayClassName?: string;
  children?: ReactNode;
};

export type DialogHeaderProps = ComponentProps<'div'>;

export type DialogFooterProps = ComponentProps<'div'> & {
  showCloseButton?: boolean;
};

export type DialogTitleProps = ComponentProps<typeof Dialog.Title>;

export type DialogDescriptionProps = ComponentProps<typeof Dialog.Description>;

export type DialogCloseProps = ButtonProps;

export type DialogOverlayContextValue = {
  setOverlayClassName: (className?: string) => void;
};
