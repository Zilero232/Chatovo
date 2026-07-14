import type { ComponentProps, ReactNode } from 'react';
import type { DialogTriggerProps, PopoverProps as RACPopoverProps } from 'react-aria-components';

export type PopoverProps = Omit<DialogTriggerProps, 'children'> & {
  open?: boolean;
  children?: ReactNode;
};

export type PopoverTriggerProps = ComponentProps<'button'> & {
  asChild?: boolean;
};

export type PopoverContentProps = Omit<RACPopoverProps, 'children'> & {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  className?: string;
  initialFocus?: boolean;
  open?: boolean;
  children?: ReactNode;
};

export type PopoverAnchorProps = ComponentProps<'div'>;

export type PopoverHeaderProps = ComponentProps<'div'>;

export type PopoverTitleProps = ComponentProps<'h2'>;

export type PopoverDescriptionProps = ComponentProps<'p'>;
