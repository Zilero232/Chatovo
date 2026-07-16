import type { Menu } from '@base-ui-components/react/menu';
import type { ComponentProps } from 'react';
import type { ButtonProps } from '../Button';

export type DropdownMenuProps = ComponentProps<typeof Menu.Root>;

export type DropdownMenuTriggerProps = ButtonProps;

export type DropdownMenuItemProps = Omit<ComponentProps<typeof Menu.Item>, 'onSelect'> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  onSelect?: () => void;
};

export type DropdownMenuSubTriggerProps = ComponentProps<typeof Menu.SubmenuTrigger> & {
  inset?: boolean;
};

export type DropdownMenuLabelProps = ComponentProps<typeof Menu.GroupLabel> & {
  inset?: boolean;
};

export type DropdownMenuContentProps = Omit<ComponentProps<typeof Menu.Popup>, 'className'> & {
  align?: ComponentProps<typeof Menu.Positioner>['align'];
  side?: ComponentProps<typeof Menu.Positioner>['side'];
  sideOffset?: number;
  className?: string;
};

export type DropdownMenuSubContentProps = {
  className?: string;
  children?: ComponentProps<typeof Menu.Popup>['children'];
};

export type DropdownMenuRadioGroupProps = ComponentProps<typeof Menu.RadioGroup>;

export type DropdownMenuRadioItemProps = ComponentProps<typeof Menu.RadioItem>;

export type DropdownMenuCheckboxItemProps = ComponentProps<typeof Menu.CheckboxItem>;

export type DropdownMenuGroupProps = ComponentProps<typeof Menu.Group>;

export type DropdownMenuSeparatorProps = ComponentProps<typeof Menu.Separator>;

export type DropdownMenuShortcutProps = ComponentProps<'span'>;

export type DropdownMenuSubProps = ComponentProps<typeof Menu.SubmenuRoot>;
