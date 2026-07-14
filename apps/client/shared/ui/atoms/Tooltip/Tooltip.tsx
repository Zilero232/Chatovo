'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { cloneElement, isValidElement } from 'react';
import { Tooltip as RACTooltip, TooltipTrigger as RACTooltipTrigger } from 'react-aria-components';
import { findChildByType } from '../../lib/overlay-children';
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
  const triggerChild = findChildByType(children, TooltipTrigger);
  const contentChild = findChildByType(children, TooltipContent);

  if (isTouch) {
    return triggerChild ?? children;
  }

  return (
    <RACTooltipTrigger
      data-slot="tooltip"
      delay={delay}
      isDisabled={disableHoverablePopup ?? disableHoverableContent}
      isOpen={open}
      {...props}
    >
      {triggerChild}
      {contentChild}
    </RACTooltipTrigger>
  );
};

const TooltipTrigger = ({ asChild, children, className, ...props }: TooltipTriggerProps) => {
  if (asChild && isValidElement(children)) {
    const childClassName = (children.props as { className?: string }).className;

    return cloneElement(children, {
      ...props,
      className: clsx(className, childClassName),
      'data-slot': 'tooltip-trigger',
    } as Record<string, unknown>);
  }

  return (
    <button className={className} data-slot="tooltip-trigger" type="button" {...props}>
      {children}
    </button>
  );
};

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
