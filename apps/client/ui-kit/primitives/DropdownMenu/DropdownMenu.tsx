'use client';

import { Menu } from '@base-ui/react/menu';
import { clsx } from 'clsx';
import { CircleIcon } from 'lucide-react';

import type {
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuTriggerProps
} from './DropdownMenu.types';

import { Button } from '../Button';

import s from './DropdownMenu.module.scss';

export const DropdownMenu = ({ children, ...props }: DropdownMenuProps) => (
  <Menu.Root data-slot='dropdown-menu' {...props}>
    {children}
  </Menu.Root>
);

export const DropdownMenuTrigger = ({
  className,
  children,
  ...props
}: DropdownMenuTriggerProps) => (
  <Menu.Trigger
    data-slot='dropdown-menu-trigger'
    render={<Button className={className} {...props} />}
  >
    {children}
  </Menu.Trigger>
);

export const DropdownMenuContent = ({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  children,
  ...props
}: DropdownMenuContentProps) => (
  <Menu.Portal>
    <Menu.Positioner align={align} className={s.positioner} side={side} sideOffset={sideOffset}>
      <Menu.Popup
        className={clsx('glass-overlay', s.popup, className)}
        data-slot='dropdown-menu-content'
        {...props}
      >
        {children}
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
);

export const DropdownMenuItem = ({
  className,
  inset,
  variant = 'default',
  onSelect,
  onClick,
  ...props
}: DropdownMenuItemProps) => (
  <Menu.Item
    className={clsx(s.item, className)}
    data-inset={inset}
    data-slot='dropdown-menu-item'
    data-variant={variant}
    onClick={(event) => {
      onSelect?.();
      onClick?.(event);
    }}
    {...props}
  />
);

export const DropdownMenuRadioGroup = ({ children, ...props }: DropdownMenuRadioGroupProps) => (
  <Menu.RadioGroup data-slot='dropdown-menu-radio-group' {...props}>
    {children}
  </Menu.RadioGroup>
);

export const DropdownMenuRadioItem = ({
  className,
  children,
  ...props
}: DropdownMenuRadioItemProps) => (
  <Menu.RadioItem
    className={clsx(s.radioItem, className)}
    data-slot='dropdown-menu-radio-item'
    {...props}
  >
    <Menu.RadioItemIndicator className={s.itemIndicator}>
      <CircleIcon className={s.radioDot} />
    </Menu.RadioItemIndicator>
    {children}
  </Menu.RadioItem>
);

export const DropdownMenuGroup = ({ className, children, ...props }: DropdownMenuGroupProps) => (
  <Menu.Group className={className} data-slot='dropdown-menu-group' {...props}>
    {children}
  </Menu.Group>
);

export const DropdownMenuLabel = ({ className, inset, ...props }: DropdownMenuLabelProps) => (
  <Menu.GroupLabel
    className={clsx(s.label, className)}
    data-inset={inset}
    data-slot='dropdown-menu-label'
    {...props}
  />
);
