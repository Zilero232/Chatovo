import type { ContextMenu } from '@base-ui-components/react/context-menu';
import type { ComponentProps, ReactNode } from 'react';

export type ContextMenuProps = {
  children?: ReactNode;
};

export type ContextMenuTriggerProps = ComponentProps<typeof ContextMenu.Trigger>;

export type ContextMenuItemProps = Omit<ComponentProps<typeof ContextMenu.Item>, 'onSelect'> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  onSelect?: () => void;
};

export type ContextMenuSubTriggerProps = ComponentProps<typeof ContextMenu.SubmenuTrigger> & {
  inset?: boolean;
};

export type ContextMenuLabelProps = ComponentProps<typeof ContextMenu.GroupLabel> & {
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

export type ContextMenuRadioGroupProps = ComponentProps<typeof ContextMenu.RadioGroup>;

export type ContextMenuRadioItemProps = ComponentProps<typeof ContextMenu.RadioItem>;

export type ContextMenuCheckboxItemProps = ComponentProps<typeof ContextMenu.CheckboxItem>;

export type ContextMenuGroupProps = ComponentProps<typeof ContextMenu.Group>;

export type ContextMenuSubProps = ComponentProps<typeof ContextMenu.SubmenuRoot>;

export type ContextMenuSeparatorProps = ComponentProps<typeof ContextMenu.Separator>;

export type ContextMenuShortcutProps = ComponentProps<'span'>;
