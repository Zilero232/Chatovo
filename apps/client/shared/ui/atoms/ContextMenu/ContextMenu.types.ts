import type { ComponentProps, ReactNode, RefObject } from 'react';
import type { MenuItemProps, MenuSection, Separator, SubmenuTrigger } from 'react-aria-components';
import type { MenuItemSelectEvent } from '../../lib/menu-types';

export type ContextMenuProps = {
  children?: ReactNode;
};

export type ContextMenuTriggerProps = ComponentProps<'div'>;

export type ContextMenuItemProps = Omit<MenuItemProps, 'onAction' | 'children'> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  onSelect?: (event: MenuItemSelectEvent) => void;
  onClick?: ComponentProps<'div'>['onClick'];
  closeOnClick?: boolean;
  children?: ReactNode;
};

export type ContextMenuSubTriggerProps = Omit<MenuItemProps, 'children'> & {
  inset?: boolean;
  children?: ReactNode;
};

export type ContextMenuLabelProps = ComponentProps<'div'> & {
  inset?: boolean;
};

export type ContextMenuContentProps = {
  className?: string;
  children?: ReactNode;
};

export type ContextMenuSubContentProps = {
  className?: string;
  children?: ReactNode;
};

export type ContextMenuRadioGroupProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
};

export type ContextMenuRadioItemProps = Omit<MenuItemProps, 'children'> & {
  value: string;
  children?: ReactNode;
};

export type ContextMenuCheckboxItemProps = Omit<MenuItemProps, 'children'> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode;
};

export type ContextMenuGroupProps = ComponentProps<typeof MenuSection>;

export type ContextMenuPortalProps = {
  children?: ReactNode;
};

export type ContextMenuSubProps = ComponentProps<typeof SubmenuTrigger>;

export type ContextMenuSeparatorProps = ComponentProps<typeof Separator>;

export type ContextMenuShortcutProps = ComponentProps<'span'>;

export type ContextMenuContextValue = {
  triggerRef: RefObject<HTMLDivElement | null>;
  setOpen: (open: boolean) => void;
};
