'use client';

import { clsx } from 'clsx';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import {
  type ComponentProps,
  cloneElement,
  createContext,
  isValidElement,
  type ReactNode,
  useContext,
} from 'react';
import {
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  Separator,
  SubmenuTrigger,
} from 'react-aria-components';
import { placementFromSideAlign } from '../../lib/overlay-children';
import s from './DropdownMenu.module.scss';
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
} from './DropdownMenu.types';

type MenuRadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const MenuRadioGroupContext = createContext<MenuRadioGroupContextValue | null>(null);

const mapMenuItemHandlers = (
  onSelect: DropdownMenuItemProps['onSelect'],
  onClick: DropdownMenuItemProps['onClick'],
  closeOnClick?: boolean,
) => {
  const shouldCloseOnSelect = closeOnClick ?? true;

  if (!onSelect) {
    return {
      onAction: onClick
        ? () => {
            onClick({} as React.MouseEvent<HTMLDivElement>);
          }
        : undefined,
      shouldCloseOnSelect,
    };
  }

  return {
    shouldCloseOnSelect,
    onAction: () => {
      let prevented = false;
      onSelect({
        preventDefault: () => {
          prevented = true;
        },
      });

      if (!prevented) {
        onClick?.({} as React.MouseEvent<HTMLDivElement>);
      }
    },
  };
};

const DropdownMenu = ({ children, ...props }: DropdownMenuProps) => (
  <MenuTrigger data-slot="dropdown-menu" {...props}>
    {children}
  </MenuTrigger>
);

const DropdownMenuPortal = ({ children }: { children?: ReactNode }) => <>{children}</>;

const DropdownMenuTrigger = ({
  asChild,
  children,
  className,
  ...props
}: DropdownMenuTriggerProps) => {
  if (asChild && isValidElement(children)) {
    const childClassName = (children.props as { className?: string }).className;

    return cloneElement(children, {
      ...props,
      className: clsx(className, childClassName),
      'data-slot': 'dropdown-menu-trigger',
    } as Record<string, unknown>);
  }

  return (
    <button className={className} data-slot="dropdown-menu-trigger" type="button" {...props}>
      {children}
    </button>
  );
};

const DropdownMenuContent = ({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  children,
  onClick,
}: DropdownMenuContentProps) => (
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

const DropdownMenuGroup = ({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuSection>) => (
  <MenuSection className={className} data-slot="dropdown-menu-group" {...props}>
    {children}
  </MenuSection>
);

const DropdownMenuItem = ({
  className,
  inset,
  variant = 'default',
  onSelect,
  onClick,
  closeOnClick,
  ...props
}: DropdownMenuItemProps) => {
  const handlers = mapMenuItemHandlers(onSelect, onClick, closeOnClick);

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
}: DropdownMenuCheckboxItemProps) => (
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

const DropdownMenuRadioGroup = ({
  value,
  onValueChange,
  children,
}: DropdownMenuRadioGroupProps) => (
  <MenuRadioGroupContext.Provider value={{ value, onValueChange }}>
    {children}
  </MenuRadioGroupContext.Provider>
);

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

const DropdownMenuLabel = ({ className, inset, ...props }: DropdownMenuLabelProps) => (
  <div
    className={clsx(s.label, className)}
    data-inset={inset}
    data-slot="dropdown-menu-label"
    {...props}
  />
);

const DropdownMenuSeparator = ({ className, ...props }: ComponentProps<typeof Separator>) => (
  <Separator
    className={clsx(s.separator, className)}
    data-slot="dropdown-menu-separator"
    {...props}
  />
);

const DropdownMenuShortcut = ({ className, ...props }: ComponentProps<'span'>) => (
  <span className={clsx(s.shortcut, className)} data-slot="dropdown-menu-shortcut" {...props} />
);

const DropdownMenuSub = ({ children, ...props }: ComponentProps<typeof SubmenuTrigger>) => (
  <SubmenuTrigger data-slot="dropdown-menu-sub" {...props}>
    {children}
  </SubmenuTrigger>
);

const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) => (
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

const DropdownMenuSubContent = ({ className, children }: DropdownMenuSubContentProps) => (
  <Popover>
    <Menu
      className={clsx('glass-overlay', s.subPopup, className)}
      data-slot="dropdown-menu-sub-content"
    >
      {children}
    </Menu>
  </Popover>
);

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
