import type { ComponentProps, ReactNode } from 'react';
import type { DialogTriggerProps, PopoverProps as RACPopoverProps } from 'react-aria-components';
import type { OverlayAlign, OverlaySide } from '../../lib/placement';
import type { ButtonProps } from '../Button';

export type PopoverProps = Omit<DialogTriggerProps, 'children'> & {
  open?: boolean;
  children?: ReactNode;
};

export type PopoverTriggerProps = ButtonProps;

export type PopoverContentProps = Omit<RACPopoverProps, 'children'> & {
  align?: OverlayAlign;
  side?: OverlaySide;
  sideOffset?: number;
  className?: string;
  initialFocus?: boolean;
  children?: ReactNode;
};

export type PopoverAnchorProps = ComponentProps<'div'>;

export type PopoverHeaderProps = ComponentProps<'div'>;

export type PopoverTitleProps = ComponentProps<'h2'>;

export type PopoverDescriptionProps = ComponentProps<'p'>;
