'use client';

import { Tooltip as BaseTooltip } from '@base-ui-components/react/tooltip';
import { useMediaQuery } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Children, isValidElement } from 'react';

import s from './Tooltip.module.scss';

import type { ReactElement } from 'react';
import type { TooltipContentProps, TooltipProps, TooltipProviderProps } from './Tooltip.types';

const TooltipProvider = ({ delay, delayDuration, children }: TooltipProviderProps) => (
  <BaseTooltip.Provider delay={delay ?? delayDuration}>{children}</BaseTooltip.Provider>
);

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
    return triggers[0] ?? null;
  }

  const {
    className: contentClassName,
    side = 'top',
    sideOffset = 0,
    children: contentChildren,
  } = content.props;

  return (
    <BaseTooltip.Root
      disabled={disableHoverablePopup ?? disableHoverableContent}
      open={open}
      {...props}
    >
      {triggers.map((trigger, index) => (
        <BaseTooltip.Trigger
          // biome-ignore lint/suspicious/noArrayIndexKey: static child list, order never changes
          key={index}
          data-slot="tooltip"
          delay={delay}
          render={trigger as ReactElement<Record<string, unknown>>}
        />
      ))}

      <BaseTooltip.Portal>
        <BaseTooltip.Positioner className={s.positioner} side={side} sideOffset={sideOffset}>
          <BaseTooltip.Popup
            className={clsx('glass-overlay', s.popup, contentClassName)}
            data-slot="tooltip-content"
          >
            {contentChildren}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
};

export { Tooltip, TooltipContent, TooltipProvider };
