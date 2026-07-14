'use client';

import { clsx } from 'clsx';
import { DialogTrigger, Popover as RACPopover } from 'react-aria-components';

import { placementFromSideAlign } from '../../lib/placement';
import { Button } from '../Button';

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
  <DialogTrigger
    data-slot="popover"
    defaultOpen={defaultOpen}
    isOpen={open}
    onOpenChange={onOpenChange}
    {...props}
  >
    {children}
  </DialogTrigger>
);

const PopoverTrigger = ({ className, ...props }: PopoverTriggerProps) => (
  <Button className={className} data-slot="popover-trigger" {...props} />
);

const PopoverContent = ({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  children,
  ...props
}: PopoverContentProps) => (
  <RACPopover
    className={clsx('glass-overlay', s.popup, className)}
    data-slot="popover-content"
    isNonModal
    offset={sideOffset}
    placement={placementFromSideAlign(side, align)}
    {...props}
  >
    {children}
  </RACPopover>
);

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
  <p className={clsx(s.description, className)} data-slot="popover-description" {...props} />
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
