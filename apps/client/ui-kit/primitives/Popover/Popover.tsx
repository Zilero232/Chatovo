'use client';

import type { ComponentProps } from 'react';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { isNullish } from 'remeda';

import type {
  PopoverAnchorProps,
  PopoverContentProps,
  PopoverDescriptionProps,
  PopoverHeaderProps,
  PopoverProps,
  PopoverTitleProps,
  PopoverTriggerProps
} from './Popover.types';

import { Button } from '../Button';
import { Text } from '../Text';
import { PopoverOpenProvider, usePopoverOpen } from './popover-open-context';
import { popoverVariants } from './Popover.motion';

import s from './Popover.module.scss';

const Popover = ({ open, defaultOpen, onOpenChange, children, ...props }: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);

  const isOpen = open ?? uncontrolledOpen;

  const handleOpenChange: NonNullable<ComponentProps<typeof BasePopover.Root>['onOpenChange']> = (
    next,
    eventDetails
  ) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next, eventDetails);
  };

  return (
    <BasePopover.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={handleOpenChange}
      {...props}
    >
      <PopoverOpenProvider isOpen={isOpen}>{children}</PopoverOpenProvider>
    </BasePopover.Root>
  );
};

const PopoverTrigger = ({ className, children, ...props }: PopoverTriggerProps) => (
  <BasePopover.Trigger
    data-slot='popover-trigger'
    render={<Button className={className} {...props} />}
  >
    {children}
  </BasePopover.Trigger>
);

const PopoverPopup = ({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  triggerRef,
  initialFocus,
  children
}: PopoverContentProps) => {
  const isOpen = usePopoverOpen();

  return (
    <BasePopover.Portal keepMounted>
      <AnimatePresence>
        {isOpen ? (
          <BasePopover.Positioner
            key='popover-positioner'
            align={align}
            anchor={triggerRef}
            className={s.positioner}
            side={side}
            sideOffset={sideOffset}
          >
            <BasePopover.Popup
              render={
                <motion.div
                  animate='visible'
                  exit='hidden'
                  initial='hidden'
                  variants={popoverVariants}
                />
              }
              className={clsx('glass-overlay', s.popup, className)}
              data-slot='popover-content'
              initialFocus={initialFocus}
            >
              {children}
            </BasePopover.Popup>
          </BasePopover.Positioner>
        ) : null}
      </AnimatePresence>
    </BasePopover.Portal>
  );
};

const PopoverContent = ({ isOpen, onOpenChange, ...props }: PopoverContentProps) => {
  if (isNullish(isOpen)) {
    return <PopoverPopup {...props} />;
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverPopup {...props} />
    </Popover>
  );
};

const PopoverAnchor = ({ className, ...props }: PopoverAnchorProps) => (
  <div className={clsx(s.anchor, className)} data-slot='popover-anchor' {...props} />
);

const PopoverHeader = ({ className, ...props }: PopoverHeaderProps) => (
  <div className={clsx(s.header, className)} data-slot='popover-header' {...props} />
);

const PopoverTitle = ({ className, ...props }: PopoverTitleProps) => (
  <div className={clsx(s.title, className)} data-slot='popover-title' {...props} />
);

const PopoverDescription = ({ className, ...props }: PopoverDescriptionProps) => (
  <Text className={className} data-slot='popover-description' tone='muted' {...props} />
);

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
};
