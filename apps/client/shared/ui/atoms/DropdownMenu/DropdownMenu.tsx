'use client';

import { clsx } from 'clsx';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import { createContext, useContext } from 'react';
import {
  Header,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  Separator,
  SubmenuTrigger,
} from 'react-aria-components';

import { mapMenuItemHandlers } from '../../lib/map-menu-item-handlers';
import { placementFromSideAlign } from '../../lib/placement';
import { Button } from '../Button';

import s from './DropdownMenu.module.scss';

import type { MenuRadioGroupContextValue } from '../../lib/menu-types';
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuPortalProps,
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

const MenuRadioGroupContext = createContext<MenuRadioGroupContextValue | null>(null);

const DropdownMenu = ({ children, ...props }: DropdownMenuProps) => {
  return (
    <MenuTrigger data-slot="dropdown-menu" {...props}>
      {children}
    </MenuTrigger>
  );
};

const DropdownMenuPortal = ({ children }: DropdownMenuPortalProps) => {
  return <>{children}</>;
};

const DropdownMenuTrigger = ({ className, ...props }: DropdownMenuTriggerProps) => {
  return <Button className={className} data-slot="dropdown-menu-trigger" {...props} />;
};

const DropdownMenuContent = ({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  children,
  onClick,
}: DropdownMenuContentProps) => {
  return (
    <Popover offset={sideOffset} placement={placementFromSideAlign(side, align)}>
      <Menu
        className={clsx('glass-overlay', s.popup, className)}
        data-slot="dropdown-menu-content"
        onClick={onClick}
      >
        {children}
      </Menu>
    </Popover>
  );
};

const DropdownMenuGroup = ({ className, children, ...props }: DropdownMenuGroupProps) => {
  return (
    <MenuSection className={className} data-slot="dropdown-menu-group" {...props}>
      {children}
    </MenuSection>
  );
};

const DropdownMenuItem = ({
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

const DropdownMenuCheckboxItem = ({
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

const DropdownMenuRadioGroup = ({
  value,
  onValueChange,
  className,
  children,
}: DropdownMenuRadioGroupProps) => {
  return (
    <MenuSection className={className} data-slot="dropdown-menu-radio-group">
      <MenuRadioGroupContext.Provider value={{ value, onValueChange }}>
        {children}
      </MenuRadioGroupContext.Provider>
    </MenuSection>
  );
};

const DropdownMenuRadioItem = ({
  className,
  children,
  value,
  ...props
}: DropdownMenuRadioItemProps) => {
  const group = useContext(MenuRadioGroupContext);
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
        {isSelected ? <CircleIcon className={s.radioDot} /> : null}
      </span>
      {children}
    </MenuItem>
  );
};

const DropdownMenuLabel = ({ className, inset, children, ...props }: DropdownMenuLabelProps) => {
  return (
    <MenuSection data-slot="dropdown-menu-label-section">
      <Header className={clsx(s.label, className)} data-inset={inset} {...props}>
        {children}
      </Header>
    </MenuSection>
  );
};

const DropdownMenuSeparator = ({ className, ...props }: DropdownMenuSeparatorProps) => {
  return (
    <Separator
      className={clsx(s.separator, className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
};

const DropdownMenuShortcut = ({ className, ...props }: DropdownMenuShortcutProps) => {
  return (
    <span className={clsx(s.shortcut, className)} data-slot="dropdown-menu-shortcut" {...props} />
  );
};

const DropdownMenuSub = ({ children, ...props }: DropdownMenuSubProps) => {
  return (
    <SubmenuTrigger data-slot="dropdown-menu-sub" {...props}>
      {children}
    </SubmenuTrigger>
  );
};

const DropdownMenuSubTrigger = ({
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

const DropdownMenuSubContent = ({ className, children }: DropdownMenuSubContentProps) => {
  return (
    <Popover>
      <Menu
        className={clsx('glass-overlay', s.subPopup, className)}
        data-slot="dropdown-menu-sub-content"
      >
        {children}
      </Menu>
    </Popover>
  );
};

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
