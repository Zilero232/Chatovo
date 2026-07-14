import type { ReactNode } from 'react';
import type { Placement } from 'react-aria';
import type {
  TooltipProps as RACTooltipProps,
  TooltipTriggerComponentProps,
} from 'react-aria-components';

export type TooltipProviderProps = {
  delay?: number;
  delayDuration?: number;
  children?: ReactNode;
};

export type TooltipProps = Omit<TooltipTriggerComponentProps, 'children'> & {
  delayDuration?: number;
  disableHoverableContent?: boolean;
  disableHoverablePopup?: boolean;
  open?: boolean;
  children?: ReactNode;
};

export type TooltipTriggerProps = {
  children?: ReactNode;
};

export type TooltipContentProps = Omit<RACTooltipProps, 'children'> & {
  side?: Placement;
  sideOffset?: number;
  className?: string;
  children?: ReactNode;
};
