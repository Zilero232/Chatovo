'use client';

import { Menu } from '@base-ui-components/react/menu';
import { clsx } from 'clsx';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';

import { Button } from '../Button';

import s from './DropdownMenu.module.scss';

import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
} from './DropdownMenu.types';

export const DropdownMenu = ({ children, ...props }: DropdownMenuProps) => {
  return (
    <Menu.Root data-slot="dropdown-menu" {...props}>
      {children}
    </Menu.Root>
  );
};

export const DropdownMenuTrigger = ({
  className,
  children,
  ...props
}: DropdownMenuTriggerProps) => {
  return (
    <Menu.Trigger
      data-slot="dropdown-menu-trigger"
      render={<Button className={className} {...props} />}
    >
      {children}
    </Menu.Trigger>
  );
};

export const DropdownMenuContent = ({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  children,
  ...props
}: DropdownMenuContentProps) => {
  return (
    <Menu.Portal>
      <Menu.Positioner align={align} className={s.positioner} side={side} sideOffset={sideOffset}>
        <Menu.Popup
          className={clsx('glass-overlay', s.popup, className)}
          data-slot="dropdown-menu-content"
          {...props}
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
};

export const DropdownMenuItem = ({
  className,
  inset,
  variant = 'default',
  onSelect,
  onClick,
  ...props
}: DropdownMenuItemProps) => {
  return (
    <Menu.Item
      className={clsx(s.item, className)}
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      onClick={(event) => {
        onSelect?.();
        onClick?.(event);
      }}
      {...props}
    />
  );
};

export const DropdownMenuCheckboxItem = ({
  className,
  children,
  ...props
}: DropdownMenuCheckboxItemProps) => {
  return (
    <Menu.CheckboxItem
      className={clsx(s.checkboxItem, className)}
      data-slot="dropdown-menu-checkbox-item"
      {...props}
    >
      <Menu.CheckboxItemIndicator className={s.itemIndicator}>
        <CheckIcon />
      </Menu.CheckboxItemIndicator>
      {children}
    </Menu.CheckboxItem>
  );
};

export const DropdownMenuRadioGroup = ({ children, ...props }: DropdownMenuRadioGroupProps) => {
  return (
    <Menu.RadioGroup data-slot="dropdown-menu-radio-group" {...props}>
      {children}
    </Menu.RadioGroup>
  );
};

export const DropdownMenuRadioItem = ({
  className,
  children,
  ...props
}: DropdownMenuRadioItemProps) => {
  return (
    <Menu.RadioItem
      className={clsx(s.radioItem, className)}
      data-slot="dropdown-menu-radio-item"
      {...props}
    >
      <Menu.RadioItemIndicator className={s.itemIndicator}>
        <CircleIcon className={s.radioDot} />
      </Menu.RadioItemIndicator>
      {children}
    </Menu.RadioItem>
  );
};

export const DropdownMenuGroup = ({ className, children, ...props }: DropdownMenuGroupProps) => {
  return (
    <Menu.Group className={className} data-slot="dropdown-menu-group" {...props}>
      {children}
    </Menu.Group>
  );
};

export const DropdownMenuLabel = ({ className, inset, ...props }: DropdownMenuLabelProps) => {
  return (
    <Menu.GroupLabel
      className={clsx(s.label, className)}
      data-inset={inset}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
};

export const DropdownMenuSeparator = ({ className, ...props }: DropdownMenuSeparatorProps) => {
  return (
    <Menu.Separator
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

export const DropdownMenuSub = ({ children, ...props }: DropdownMenuSubProps) => {
  return <Menu.SubmenuRoot {...props}>{children}</Menu.SubmenuRoot>;
};

export const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) => {
  return (
    <Menu.SubmenuTrigger
      className={clsx(s.subTrigger, className)}
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon className={s.subTriggerChevron} />
    </Menu.SubmenuTrigger>
  );
};

export const DropdownMenuSubContent = ({ className, children }: DropdownMenuSubContentProps) => {
  return (
    <Menu.Portal>
      <Menu.Positioner className={s.positioner}>
        <Menu.Popup
          className={clsx('glass-overlay', s.subPopup, className)}
          data-slot="dropdown-menu-sub-content"
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
};
