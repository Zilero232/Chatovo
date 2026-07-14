'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Tooltip as RACTooltip, TooltipTrigger as RACTooltipTrigger } from 'react-aria-components';

import s from './Tooltip.module.scss';

import type {
  TooltipContentProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipTriggerProps,
} from './Tooltip.types';

const TooltipProvider = ({ children }: TooltipProviderProps) => <>{children}</>;

const Tooltip = ({
  delayDuration,
  delay = delayDuration,
  disableHoverableContent,
  disableHoverablePopup,
  open,
  children,
  ...props
}: TooltipProps) => {
  const isTouch = useMediaQuery('(hover: none), (pointer: coarse)');

  return (
    <RACTooltipTrigger
      data-slot="tooltip"
      delay={delay}
      isDisabled={isTouch || (disableHoverablePopup ?? disableHoverableContent)}
      isOpen={open}
      {...props}
    >
      {children}
    </RACTooltipTrigger>
  );
};

const TooltipTrigger = ({ children }: TooltipTriggerProps) => children;

const TooltipContent = ({
  className,
  side,
  sideOffset = 0,
  children,
  ...props
}: TooltipContentProps) => {
  const isTouch = useMediaQuery('(hover: none), (pointer: coarse)');

  if (isTouch) {
    return null;
  }

  return (
    <RACTooltip
      className={clsx('glass-overlay', s.popup, className)}
      data-slot="tooltip-content"
      offset={sideOffset}
      placement={side}
      {...props}
    >
      {children}
    </RACTooltip>
  );
};

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
