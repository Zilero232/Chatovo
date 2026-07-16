'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Children, isValidElement } from 'react';
import { Tooltip as RACTooltip, TooltipTrigger as RACTooltipTrigger } from 'react-aria-components';

import { wrapTooltipTrigger } from './lib';

import s from './Tooltip.module.scss';

import type { ReactElement } from 'react';
import type { TooltipContentProps, TooltipProps, TooltipProviderProps } from './Tooltip.types';

const TooltipProvider = ({ children }: TooltipProviderProps) => <>{children}</>;

const TooltipContent = (_props: TooltipContentProps) => null;

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

  const items = Children.toArray(children);
  const content = items.find(
    (child): child is ReactElement<TooltipContentProps> =>
      isValidElement(child) && child.type === TooltipContent,
  );
  const triggers = items.filter(
    (child) => !(isValidElement(child) && child.type === TooltipContent),
  );

  if (isTouch || !content || triggers.length === 0) {
    return wrapTooltipTrigger(triggers[0]);
  }

  const {
    className: contentClassName,
    side,
    sideOffset = 0,
    children: contentChildren,
    ...contentProps
  } = content.props;

  const trigger = triggers.length === 1 ? triggers[0] : triggers;

  return (
    <RACTooltipTrigger
      data-slot="tooltip"
      delay={delay}
      isDisabled={disableHoverablePopup ?? disableHoverableContent}
      isOpen={open}
      {...props}
    >
      {wrapTooltipTrigger(trigger)}
      <RACTooltip
        className={clsx('glass-overlay', s.popup, contentClassName)}
        data-slot="tooltip-content"
        offset={sideOffset}
        placement={side}
        {...contentProps}
      >
        {contentChildren}
      </RACTooltip>
    </RACTooltipTrigger>
  );
};

export { Tooltip, TooltipContent, TooltipProvider };
