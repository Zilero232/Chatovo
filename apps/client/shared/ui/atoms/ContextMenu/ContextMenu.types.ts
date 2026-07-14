import type { ComponentProps, ReactNode, RefObject } from 'react';
import type { MenuItemProps } from 'react-aria-components';

export type ContextMenuProps = {
  children?: ReactNode;
};

export type ContextMenuTriggerProps = ComponentProps<'div'> & {
  asChild?: boolean;
};

export type ContextMenuItemProps = Omit<MenuItemProps, 'onAction' | 'children'> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  onSelect?: (event: { preventDefault: () => void }) => void;
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
  triggerRef?: RefObject<HTMLElement | null>;
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
