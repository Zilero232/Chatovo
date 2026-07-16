import type { Popover } from '@base-ui-components/react/popover';
import type { ComponentProps, ReactNode, RefObject } from 'react';
import type { ButtonProps } from '../Button';

export type PopoverProps = Omit<ComponentProps<typeof Popover.Root>, 'children' | 'open'> & {
  open?: boolean;
  children?: ReactNode;
};

export type PopoverTriggerProps = ButtonProps;

export type PopoverContentProps = {
  align?: ComponentProps<typeof Popover.Positioner>['align'];
  side?: ComponentProps<typeof Popover.Positioner>['side'];
  sideOffset?: number;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerRef?: RefObject<HTMLElement | null>;
  initialFocus?: ComponentProps<typeof Popover.Popup>['initialFocus'];
  children?: ReactNode;
};

export type PopoverAnchorProps = ComponentProps<'div'>;

export type PopoverHeaderProps = ComponentProps<'div'>;

export type PopoverTitleProps = ComponentProps<'h2'>;

export type PopoverDescriptionProps = ComponentProps<'p'>;
