import type { ComponentProps } from 'react';
import type { Placement } from 'react-aria';
import type {
  TooltipProps as RACTooltipProps,
  TooltipTriggerComponentProps,
} from 'react-aria-components';

export type TooltipProviderProps = {
  delay?: number;
  delayDuration?: number;
  children?: React.ReactNode;
};

export type TooltipProps = Omit<TooltipTriggerComponentProps, 'children'> & {
  delayDuration?: number;
  disableHoverableContent?: boolean;
  disableHoverablePopup?: boolean;
  open?: boolean;
  children?: React.ReactNode;
};

export type TooltipTriggerProps = ComponentProps<'button'> & {
  asChild?: boolean;
};

export type TooltipContentProps = Omit<RACTooltipProps, 'children'> & {
  side?: Placement;
  sideOffset?: number;
  className?: string;
  children?: React.ReactNode;
};
