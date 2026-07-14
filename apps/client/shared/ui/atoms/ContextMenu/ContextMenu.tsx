'use client';

import { clsx } from 'clsx';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import { createContext, useContext, useRef, useState } from 'react';
import {
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  Separator,
  SubmenuTrigger,
} from 'react-aria-components';

import { mapMenuItemHandlers } from '../../lib/map-menu-item-handlers';

import s from './ContextMenu.module.scss';

import type { MenuRadioGroupContextValue } from '../../lib/menu-types';
import type {
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuContextValue,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuLabelProps,
  ContextMenuPortalProps,
  ContextMenuProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
  ContextMenuSubContentProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuTriggerProps,
} from './ContextMenu.types';

const MenuRadioGroupContext = createContext<MenuRadioGroupContextValue | null>(null);
const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

const ContextMenu = ({ children }: ContextMenuProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <ContextMenuContext.Provider value={{ triggerRef, setOpen }}>
      <MenuTrigger data-slot="context-menu" isOpen={open} onOpenChange={setOpen}>
        {children}
      </MenuTrigger>
    </ContextMenuContext.Provider>
  );
};

const ContextMenuTrigger = ({
  className,
  children,
  onContextMenu,
  ...props
}: ContextMenuTriggerProps) => {
  const context = useContext(ContextMenuContext);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: right-click target for context menu
    <div
      ref={context?.triggerRef}
      aria-haspopup="menu"
      className={className}
      data-slot="context-menu-trigger"
      onContextMenu={(event) => {
        event.preventDefault();
        context?.setOpen(true);
        onContextMenu?.(event);
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const ContextMenuGroup = ({ className, children, ...props }: ContextMenuGroupProps) => {
  return (
    <MenuSection className={className} data-slot="context-menu-group" {...props}>
      {children}
    </MenuSection>
  );
};

const ContextMenuPortal = ({ children }: ContextMenuPortalProps) => {
  return <>{children}</>;
};

const ContextMenuSub = ({ children, ...props }: ContextMenuSubProps) => {
  return (
    <SubmenuTrigger data-slot="context-menu-sub" {...props}>
      {children}
    </SubmenuTrigger>
  );
};

const ContextMenuRadioGroup = ({ value, onValueChange, children }: ContextMenuRadioGroupProps) => {
  return (
    <MenuRadioGroupContext.Provider value={{ value, onValueChange }}>
      {children}
    </MenuRadioGroupContext.Provider>
  );
};

const ContextMenuSubTrigger = ({
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

const ContextMenuSubContent = ({ className, children }: ContextMenuSubContentProps) => {
  return (
    <Popover>
      <Menu className={clsx(s.subPopup, className)} data-slot="context-menu-sub-content">
        {children}
      </Menu>
    </Popover>
  );
};

const ContextMenuContent = ({ className, children }: ContextMenuContentProps) => {
  const context = useContext(ContextMenuContext);

  return (
    <Popover triggerRef={context?.triggerRef}>
      <Menu className={clsx(s.popup, className)} data-slot="context-menu-content">
        {children}
      </Menu>
    </Popover>
  );
};

const ContextMenuItem = ({
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

const ContextMenuCheckboxItem = ({
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

const ContextMenuRadioItem = ({
  className,
  children,
  value,
  ...props
}: ContextMenuRadioItemProps) => {
  const group = useContext(MenuRadioGroupContext);
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

const ContextMenuLabel = ({ className, inset, ...props }: ContextMenuLabelProps) => {
  return (
    <div
      className={clsx(s.label, className)}
      data-inset={inset}
      data-slot="context-menu-label"
      {...props}
    />
  );
};

const ContextMenuSeparator = ({ className, ...props }: ContextMenuSeparatorProps) => {
  return (
    <Separator
      className={clsx(s.separator, className)}
      data-slot="context-menu-separator"
      {...props}
    />
  );
};

const ContextMenuShortcut = ({ className, ...props }: ContextMenuShortcutProps) => {
  return (
    <span className={clsx(s.shortcut, className)} data-slot="context-menu-shortcut" {...props} />
  );
};

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
