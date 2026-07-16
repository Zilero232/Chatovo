'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui-components/react/context-menu';
import { clsx } from 'clsx';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';

import s from './ContextMenu.module.scss';

import type {
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuLabelProps,
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

export const ContextMenu = ({ children }: ContextMenuProps) => {
  return <BaseContextMenu.Root>{children}</BaseContextMenu.Root>;
};

export const ContextMenuTrigger = ({ className, children, ...props }: ContextMenuTriggerProps) => {
  return (
    <BaseContextMenu.Trigger className={className} data-slot="context-menu-trigger" {...props}>
      {children}
    </BaseContextMenu.Trigger>
  );
};

export const ContextMenuContent = ({ className, children }: ContextMenuContentProps) => {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner className={s.positioner}>
        <BaseContextMenu.Popup
          className={clsx(s.popup, className)}
          data-slot="context-menu-content"
        >
          {children}
        </BaseContextMenu.Popup>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
};

export const ContextMenuItem = ({
  className,
  inset,
  variant = 'default',
  onSelect,
  onClick,
  ...props
}: ContextMenuItemProps) => {
  return (
    <BaseContextMenu.Item
      className={clsx(s.item, className)}
      data-inset={inset}
      data-slot="context-menu-item"
      data-variant={variant}
      onClick={(event) => {
        onSelect?.();
        onClick?.(event);
      }}
      {...props}
    />
  );
};

export const ContextMenuCheckboxItem = ({
  className,
  children,
  ...props
}: ContextMenuCheckboxItemProps) => {
  return (
    <BaseContextMenu.CheckboxItem
      className={clsx(s.checkboxItem, className)}
      data-slot="context-menu-checkbox-item"
      {...props}
    >
      <BaseContextMenu.CheckboxItemIndicator className={s.itemIndicator}>
        <CheckIcon />
      </BaseContextMenu.CheckboxItemIndicator>
      {children}
    </BaseContextMenu.CheckboxItem>
  );
};

export const ContextMenuRadioGroup = ({ children, ...props }: ContextMenuRadioGroupProps) => {
  return (
    <BaseContextMenu.RadioGroup data-slot="context-menu-radio-group" {...props}>
      {children}
    </BaseContextMenu.RadioGroup>
  );
};

export const ContextMenuRadioItem = ({
  className,
  children,
  ...props
}: ContextMenuRadioItemProps) => {
  return (
    <BaseContextMenu.RadioItem
      className={clsx(s.radioItem, className)}
      data-slot="context-menu-radio-item"
      {...props}
    >
      <BaseContextMenu.RadioItemIndicator className={s.itemIndicator}>
        <CircleIcon className={s.radioDot} />
      </BaseContextMenu.RadioItemIndicator>
      {children}
    </BaseContextMenu.RadioItem>
  );
};

export const ContextMenuGroup = ({ className, children, ...props }: ContextMenuGroupProps) => {
  return (
    <BaseContextMenu.Group className={className} data-slot="context-menu-group" {...props}>
      {children}
    </BaseContextMenu.Group>
  );
};

export const ContextMenuLabel = ({ className, inset, ...props }: ContextMenuLabelProps) => {
  return (
    <BaseContextMenu.GroupLabel
      className={clsx(s.label, className)}
      data-inset={inset}
      data-slot="context-menu-label"
      {...props}
    />
  );
};

export const ContextMenuSeparator = ({ className, ...props }: ContextMenuSeparatorProps) => {
  return (
    <BaseContextMenu.Separator
      className={clsx(s.separator, className)}
      data-slot="context-menu-separator"
      {...props}
    />
  );
};

export const ContextMenuShortcut = ({ className, ...props }: ContextMenuShortcutProps) => {
  return (
    <span className={clsx(s.shortcut, className)} data-slot="context-menu-shortcut" {...props} />
  );
};

export const ContextMenuSub = ({ children, ...props }: ContextMenuSubProps) => {
  return <BaseContextMenu.SubmenuRoot {...props}>{children}</BaseContextMenu.SubmenuRoot>;
};

export const ContextMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: ContextMenuSubTriggerProps) => {
  return (
    <BaseContextMenu.SubmenuTrigger
      className={clsx(s.subTrigger, className)}
      data-inset={inset}
      data-slot="context-menu-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon className={s.subTriggerChevron} />
    </BaseContextMenu.SubmenuTrigger>
  );
};

export const ContextMenuSubContent = ({ className, children }: ContextMenuSubContentProps) => {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner className={s.positioner}>
        <BaseContextMenu.Popup
          className={clsx(s.subPopup, className)}
          data-slot="context-menu-sub-content"
        >
          {children}
        </BaseContextMenu.Popup>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
};
