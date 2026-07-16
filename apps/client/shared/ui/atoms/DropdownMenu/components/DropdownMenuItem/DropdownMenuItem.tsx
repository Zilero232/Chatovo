'use client';

import { clsx } from 'clsx';
import { CheckIcon } from 'lucide-react';
import { MenuItem } from 'react-aria-components';

import { mapMenuItemHandlers } from '../../../../lib/map-menu-item-handlers';
import { useMenuRadioGroup } from '../../../../lib/menu-radio-group-context';

import s from '../../DropdownMenu.module.scss';

import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuItemProps,
  DropdownMenuRadioItemProps,
} from '../../DropdownMenu.types';

export const DropdownMenuItem = ({
  className,
  inset,
  variant = 'default',
  onSelect,
  onClick,
  closeOnClick,
  ...props
}: DropdownMenuItemProps) => {
  const handlers = mapMenuItemHandlers({ onSelect, onClick, closeOnClick });

  return (
    <MenuItem
      className={clsx(s.item, className)}
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      shouldCloseOnSelect={handlers.shouldCloseOnSelect}
      onAction={handlers.onAction}
      {...props}
    />
  );
};

export const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: DropdownMenuCheckboxItemProps) => {
  return (
    <MenuItem
      className={clsx(s.checkboxItem, className)}
      data-slot="dropdown-menu-checkbox-item"
      onAction={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span className={s.itemIndicator}>{checked ? <CheckIcon /> : null}</span>
      {children}
    </MenuItem>
  );
};

export const DropdownMenuRadioItem = ({
  className,
  children,
  value,
  ...props
}: DropdownMenuRadioItemProps) => {
  const group = useMenuRadioGroup();
  const isSelected = group?.value === value;

  return (
    <MenuItem
      className={clsx(s.radioItem, className)}
      data-slot="dropdown-menu-radio-item"
      id={value}
      onAction={() => group?.onValueChange?.(value)}
      {...props}
    >
      <span className={s.itemIndicator}>
        {isSelected ? <CheckIcon className={s.radioDot} /> : null}
      </span>
      {children}
    </MenuItem>
  );
};
