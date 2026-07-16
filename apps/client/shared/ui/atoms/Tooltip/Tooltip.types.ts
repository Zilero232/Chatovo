import type { Tooltip } from '@base-ui-components/react/tooltip';
import type { ComponentProps, ReactNode } from 'react';

export type TooltipSide = ComponentProps<typeof Tooltip.Positioner>['side'];

export type TooltipProviderProps = {
  delay?: number;
  delayDuration?: number;
  children?: ReactNode;
};

export type TooltipProps = Omit<
  ComponentProps<typeof Tooltip.Root>,
  'children' | 'open' | 'delay'
> & {
  delay?: number;
  delayDuration?: number;
  disableHoverableContent?: boolean;
  disableHoverablePopup?: boolean;
  open?: boolean;
  children?: ReactNode;
};

export type TooltipContentProps = {
  side?: TooltipSide;
  sideOffset?: number;
  className?: string;
  children?: ReactNode;
};
