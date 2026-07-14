import type { ComponentProps, ReactNode } from 'react';
import type { MenuItemProps, MenuSection, Separator, SubmenuTrigger } from 'react-aria-components';
import type { MenuItemSelectEvent } from '../../lib/menu-types';
import type { OverlayAlign, OverlaySide } from '../../lib/placement';
import type { ButtonProps } from '../Button';

export type DropdownMenuProps = {
  modal?: boolean;
  children?: ReactNode;
};

export type DropdownMenuTriggerProps = ButtonProps;

export type DropdownMenuPortalProps = {
  children?: ReactNode;
};

export type DropdownMenuItemProps = Omit<MenuItemProps, 'onAction' | 'children'> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  onSelect?: (event: MenuItemSelectEvent) => void;
  onClick?: ComponentProps<'div'>['onClick'];
  closeOnClick?: boolean;
  children?: ReactNode;
};

export type DropdownMenuSubTriggerProps = Omit<MenuItemProps, 'children'> & {
  inset?: boolean;
  children?: ReactNode;
};

export type DropdownMenuLabelProps = ComponentProps<'div'> & {
  inset?: boolean;
};

export type DropdownMenuContentProps = ComponentProps<'div'> & {
  align?: OverlayAlign;
  side?: OverlaySide;
  sideOffset?: number;
  className?: string;
  children?: ReactNode;
};

export type DropdownMenuSubContentProps = {
  className?: string;
  children?: ReactNode;
};

export type DropdownMenuRadioGroupProps = ComponentProps<'div'> & {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
};

export type DropdownMenuRadioItemProps = {
  value: string;
  className?: string;
  children?: ReactNode;
  isDisabled?: boolean;
};

export type DropdownMenuCheckboxItemProps = Omit<MenuItemProps, 'children'> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode;
};

export type DropdownMenuGroupProps = ComponentProps<typeof MenuSection>;

export type DropdownMenuSeparatorProps = ComponentProps<typeof Separator>;

export type DropdownMenuShortcutProps = ComponentProps<'span'>;

export type DropdownMenuSubProps = ComponentProps<typeof SubmenuTrigger>;
