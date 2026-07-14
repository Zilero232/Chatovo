import type { ComponentProps, ReactNode } from 'react';
import type { MenuItemProps } from 'react-aria-components';

export type DropdownMenuProps = {
  modal?: boolean;
  children?: ReactNode;
};

export type DropdownMenuTriggerProps = ComponentProps<'button'> & {
  asChild?: boolean;
};

export type DropdownMenuItemProps = Omit<MenuItemProps, 'onAction' | 'children'> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  onSelect?: (event: { preventDefault: () => void }) => void;
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
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
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
