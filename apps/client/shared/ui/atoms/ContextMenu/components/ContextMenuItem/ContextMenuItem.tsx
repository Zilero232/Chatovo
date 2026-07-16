'use client';

import { clsx } from 'clsx';
import { CheckIcon, CircleIcon } from 'lucide-react';
import { MenuItem } from 'react-aria-components';

import { mapMenuItemHandlers } from '../../../../lib/map-menu-item-handlers';
import { useMenuRadioGroup } from '../../../../lib/menu-radio-group-context';

import s from '../../ContextMenu.module.scss';

import type {
  ContextMenuCheckboxItemProps,
  ContextMenuItemProps,
  ContextMenuRadioItemProps,
} from '../../ContextMenu.types';

export const ContextMenuItem = ({
  className,
  inset,
  variant = 'default',
  onSelect,
  onClick,
  closeOnClick,
  ...props
}: ContextMenuItemProps) => {
  const handlers = mapMenuItemHandlers({ onSelect, onClick, closeOnClick });

  return (
    <MenuItem
      className={clsx(s.item, className)}
      data-inset={inset}
      data-slot="context-menu-item"
      data-variant={variant}
      shouldCloseOnSelect={handlers.shouldCloseOnSelect}
      onAction={handlers.onAction}
      {...props}
    />
  );
};

export const ContextMenuCheckboxItem = ({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: ContextMenuCheckboxItemProps) => {
  return (
    <MenuItem
      className={clsx(s.checkboxItem, className)}
      data-slot="context-menu-checkbox-item"
      onAction={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span className={s.itemIndicator}>{checked ? <CheckIcon /> : null}</span>
      {children}
    </MenuItem>
  );
};

export const ContextMenuRadioItem = ({
  className,
  children,
  value,
  ...props
}: ContextMenuRadioItemProps) => {
  const group = useMenuRadioGroup();
  const isSelected = group?.value === value;

  return (
    <MenuItem
      className={clsx(s.radioItem, className)}
      data-slot="context-menu-radio-item"
      id={value}
      onAction={() => group?.onValueChange?.(value)}
      {...props}
    >
      <span className={s.itemIndicator}>
        {isSelected ? <CircleIcon className={s.radioDot} /> : null}
      </span>
      {children}
    </MenuItem>
  );
};
