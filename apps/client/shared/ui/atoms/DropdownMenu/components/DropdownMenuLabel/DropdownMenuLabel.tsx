'use client';

import { clsx } from 'clsx';
import { ChevronRightIcon } from 'lucide-react';
import { Header, MenuItem, MenuSection, Separator } from 'react-aria-components';

import s from '../../DropdownMenu.module.scss';

import type {
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubTriggerProps,
} from '../../DropdownMenu.types';

export const DropdownMenuLabel = ({
  className,
  inset,
  children,
  ...props
}: DropdownMenuLabelProps) => {
  return (
    <MenuSection data-slot="dropdown-menu-label-section">
      <Header className={clsx(s.label, className)} data-inset={inset} {...props}>
        {children}
      </Header>
    </MenuSection>
  );
};

export const DropdownMenuSeparator = ({ className, ...props }: DropdownMenuSeparatorProps) => {
  return (
    <Separator
      className={clsx(s.separator, className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
};

export const DropdownMenuShortcut = ({ className, ...props }: DropdownMenuShortcutProps) => {
  return (
    <span className={clsx(s.shortcut, className)} data-slot="dropdown-menu-shortcut" {...props} />
  );
};

export const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) => {
  return (
    <MenuItem
      className={clsx(s.subTrigger, className)}
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon className={s.subTriggerChevron} />
    </MenuItem>
  );
};
