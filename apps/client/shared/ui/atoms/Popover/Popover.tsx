'use client';

import { clsx } from 'clsx';
import { cloneElement, isValidElement, type Ref, useRef } from 'react';
import { DialogTrigger, Popover as RACPopover } from 'react-aria-components';
import { findChildByType, placementFromSideAlign } from '../../lib/overlay-children';
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

const mergeRefs =
  <T,>(...refs: Array<Ref<T> | undefined>) =>
  (value: T | null) => {
    for (const ref of refs) {
      if (!ref) {
        continue;
      }

      if (typeof ref === 'function') {
        ref(value);
        continue;
      }

      ref.current = value;
    }
  };

const Popover = ({ open, defaultOpen, onOpenChange, children, ...props }: PopoverProps) => {
  const triggerRef = useRef<HTMLElement>(null);
  const triggerChild = findChildByType(children, PopoverTrigger);
  const contentChild = findChildByType(children, PopoverContent);
  const isControlled = open !== undefined;

  const trigger = triggerChild
    ? cloneElement(triggerChild, {
        ref: mergeRefs(triggerRef, (triggerChild.props as { ref?: Ref<HTMLElement> }).ref),
      } as Record<string, unknown>)
    : null;

  const content = contentChild
    ? cloneElement(contentChild, {
        triggerRef,
        open: isControlled ? open : undefined,
        onOpenChange,
      } as Record<string, unknown>)
    : null;

  if (isControlled) {
    return (
      <>
        {trigger}
        {content}
      </>
    );
  }

  return (
    <DialogTrigger
      data-slot="popover"
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      {...props}
    >
      {trigger}
      {content}
    </DialogTrigger>
  );
};

const PopoverTrigger = ({ asChild, children, className, ...props }: PopoverTriggerProps) => {
  if (asChild && isValidElement(children)) {
    const childClassName = (children.props as { className?: string }).className;

    return cloneElement(children, {
      ...props,
      className: clsx(className, childClassName),
      'data-slot': 'popover-trigger',
    } as Record<string, unknown>);
  }

  return (
    <button className={className} data-slot="popover-trigger" type="button" {...props}>
      {children}
    </button>
  );
};

const PopoverContent = ({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  initialFocus = true,
  triggerRef,
  children,
  open,
  onOpenChange,
  ...props
}: PopoverContentProps & {
  triggerRef?: React.RefObject<HTMLElement | null>;
}) => (
  <RACPopover
    className={clsx('glass-overlay', s.popup, className)}
    data-slot="popover-content"
    isNonModal
    isOpen={open}
    offset={sideOffset}
    placement={placementFromSideAlign(side, align)}
    triggerRef={triggerRef}
    onOpenChange={onOpenChange}
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
