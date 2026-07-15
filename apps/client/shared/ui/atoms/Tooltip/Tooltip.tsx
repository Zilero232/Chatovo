'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Children, isValidElement } from 'react';
import {
  Focusable,
  Pressable,
  Button as RACButton,
  Tooltip as RACTooltip,
  TooltipTrigger as RACTooltipTrigger,
} from 'react-aria-components';

import { Button } from '../Button';

import s from './Tooltip.module.scss';

import type { ReactElement, ReactNode } from 'react';
import type { TooltipContentProps, TooltipProps, TooltipProviderProps } from './Tooltip.types';

const TooltipProvider = ({ children }: TooltipProviderProps) => <>{children}</>;

const isPressableTrigger = (child: ReactElement<{ role?: string }>) => {
  const { type } = child;

  if (type === Pressable || type === Focusable || type === Button || type === RACButton) {
    return true;
  }

  if (typeof type === 'function' && 'displayName' in type && type.displayName === 'Button') {
    return true;
  }

  return type === 'button' || type === 'a';
};

const wrapTooltipTrigger = (child: ReactNode) => {
  if (!isValidElement<{ role?: string }>(child)) {
    return child;
  }

  if (isPressableTrigger(child)) {
    return child;
  }

  const needsFocusable =
    child.type === 'span' || child.props.role === 'img' || child.props.role === 'presentation';

  if (needsFocusable) {
    return <Focusable>{child as never}</Focusable>;
  }

  return <Pressable>{child as never}</Pressable>;
};

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
