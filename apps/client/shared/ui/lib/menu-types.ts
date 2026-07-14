import type { ComponentProps } from 'react';

export type MenuRadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
};

export type MenuItemSelectEvent = {
  preventDefault: () => void;
};

export type OverlayMenuItemHandlers = {
  onSelect?: (event: MenuItemSelectEvent) => void;
  onClick?: ComponentProps<'div'>['onClick'];
  closeOnClick?: boolean;
};

export type MappedMenuItemHandlers = {
  onAction?: () => void;
  shouldCloseOnSelect: boolean;
};
