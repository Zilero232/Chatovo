'use client';

import { Popover as BasePopover } from '@base-ui-components/react/popover';
import { clsx } from 'clsx';
import { isNullish } from 'remeda';

import { Button } from '../Button';
import { Text } from '../Text';

import s from './Popover.module.scss';

import type {
  PopoverAnchorProps,
  PopoverContentProps,
  PopoverDescriptionProps,
  PopoverHeaderProps,
  PopoverProps,
  PopoverTitleProps,
  PopoverTriggerProps,
} from './Popover.types';

const Popover = ({ open, defaultOpen, onOpenChange, children, ...props }: PopoverProps) => (
  <BasePopover.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange} {...props}>
    {children}
  </BasePopover.Root>
);

const PopoverTrigger = ({ className, children, ...props }: PopoverTriggerProps) => (
  <BasePopover.Trigger
    data-slot="popover-trigger"
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
  children,
}: PopoverContentProps) => (
  <BasePopover.Portal>
    <BasePopover.Positioner
      align={align}
      anchor={triggerRef}
      className={s.positioner}
      side={side}
      sideOffset={sideOffset}
    >
      <BasePopover.Popup
        className={clsx('glass-overlay', s.popup, className)}
        data-slot="popover-content"
        initialFocus={initialFocus}
      >
        {children}
      </BasePopover.Popup>
    </BasePopover.Positioner>
  </BasePopover.Portal>
);

const PopoverContent = ({ isOpen, onOpenChange, ...props }: PopoverContentProps) => {
  if (isNullish(isOpen)) {
    return <PopoverPopup {...props} />;
  }

  return (
    <BasePopover.Root open={isOpen} onOpenChange={onOpenChange}>
      <PopoverPopup {...props} />
    </BasePopover.Root>
  );
};

const PopoverAnchor = ({ className, ...props }: PopoverAnchorProps) => (
  <div className={clsx(s.anchor, className)} data-slot="popover-anchor" {...props} />
);

const PopoverHeader = ({ className, ...props }: PopoverHeaderProps) => (
  <div className={clsx(s.header, className)} data-slot="popover-header" {...props} />
);

const PopoverTitle = ({ className, ...props }: PopoverTitleProps) => (
  <div className={clsx(s.title, className)} data-slot="popover-title" {...props} />
);

const PopoverDescription = ({ className, ...props }: PopoverDescriptionProps) => (
  <Text className={className} data-slot="popover-description" tone="muted" {...props} />
);

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
