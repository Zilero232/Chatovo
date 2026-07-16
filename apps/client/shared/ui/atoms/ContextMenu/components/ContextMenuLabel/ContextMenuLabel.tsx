'use client';

import { clsx } from 'clsx';
import { ChevronRightIcon } from 'lucide-react';
import { MenuItem, Separator } from 'react-aria-components';

import s from '../../ContextMenu.module.scss';

import type {
  ContextMenuLabelProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
  ContextMenuSubTriggerProps,
} from '../../ContextMenu.types';

export const ContextMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: ContextMenuSubTriggerProps) => {
  return (
    <MenuItem
      className={clsx(s.subTrigger, className)}
      data-inset={inset}
      data-slot="context-menu-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon className={s.subTriggerChevron} />
    </MenuItem>
  );
};

export const ContextMenuLabel = ({ className, inset, ...props }: ContextMenuLabelProps) => {
  return (
    <div
      className={clsx(s.label, className)}
      data-inset={inset}
      data-slot="context-menu-label"
      {...props}
    />
  );
};

export const ContextMenuSeparator = ({ className, ...props }: ContextMenuSeparatorProps) => {
  return (
    <Separator
      className={clsx(s.separator, className)}
      data-slot="context-menu-separator"
      {...props}
    />
  );
};

export const ContextMenuShortcut = ({ className, ...props }: ContextMenuShortcutProps) => {
  return (
    <span className={clsx(s.shortcut, className)} data-slot="context-menu-shortcut" {...props} />
  );
};
