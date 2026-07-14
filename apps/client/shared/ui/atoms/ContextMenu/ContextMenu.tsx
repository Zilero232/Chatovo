'use client';

import { clsx } from 'clsx';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import {
  type ComponentProps,
  cloneElement,
  createContext,
  isValidElement,
  type MouseEvent,
  type ReactNode,
  type Ref,
  useContext,
  useRef,
  useState,
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
import { findChildByType } from '../../lib/overlay-children';
import s from './ContextMenu.module.scss';
import type {
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuLabelProps,
  ContextMenuProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuSubContentProps,
  ContextMenuSubTriggerProps,
  ContextMenuTriggerProps,
} from './ContextMenu.types';

type MenuRadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const MenuRadioGroupContext = createContext<MenuRadioGroupContextValue | null>(null);

const mergeRefs =
  <T,>(...refs: Array<Ref<T> | undefined>) =>
  (value: T | null) => {
    for (const ref of refs) {
      if (!ref) {
        continue;
      }

      if (typeof ref === 'function') {
        ref(value);
        continue;
      }

      ref.current = value;
    }
  };

const mapMenuItemHandlers = (
  onSelect: ContextMenuItemProps['onSelect'],
  onClick: ContextMenuItemProps['onClick'],
  closeOnClick?: boolean,
) => {
  const shouldCloseOnSelect = closeOnClick ?? true;

  if (!onSelect) {
    return {
      onAction: onClick
        ? () => {
            onClick({} as MouseEvent<HTMLDivElement>);
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
        onClick?.({} as MouseEvent<HTMLDivElement>);
      }
    },
  };
};

const ContextMenu = ({ children }: ContextMenuProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const triggerChild = findChildByType(children, ContextMenuTrigger);
  const contentChild = findChildByType(children, ContextMenuContent);

  const trigger = triggerChild
    ? cloneElement(triggerChild, {
        ref: mergeRefs(triggerRef, (triggerChild.props as { ref?: Ref<HTMLElement> }).ref),
        onContextMenu: (event: MouseEvent<HTMLElement>) => {
          event.preventDefault();
          setOpen(true);
          (
            triggerChild.props as { onContextMenu?: (event: MouseEvent<HTMLElement>) => void }
          ).onContextMenu?.(event);
        },
      } as Record<string, unknown>)
    : null;

  const content = contentChild
    ? cloneElement(contentChild, { triggerRef } as Record<string, unknown>)
    : null;

  return (
    <MenuTrigger data-slot="context-menu" isOpen={open} onOpenChange={setOpen}>
      {trigger}
      {content}
    </MenuTrigger>
  );
};

const ContextMenuTrigger = ({
  asChild,
  children,
  className,
  ...props
}: ContextMenuTriggerProps) => {
  if (asChild && isValidElement(children)) {
    const childClassName = (children.props as { className?: string }).className;

    return cloneElement(children, {
      ...props,
      className: clsx(className, childClassName),
      'data-slot': 'context-menu-trigger',
    } as Record<string, unknown>);
  }

  return (
    <div className={className} data-slot="context-menu-trigger" {...props}>
      {children}
    </div>
  );
};

const ContextMenuGroup = ({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuSection>) => (
  <MenuSection className={className} data-slot="context-menu-group" {...props}>
    {children}
  </MenuSection>
);

const ContextMenuPortal = ({ children }: { children?: ReactNode }) => <>{children}</>;

const ContextMenuSub = ({ children, ...props }: ComponentProps<typeof SubmenuTrigger>) => (
  <SubmenuTrigger data-slot="context-menu-sub" {...props}>
    {children}
  </SubmenuTrigger>
);

const ContextMenuRadioGroup = ({ value, onValueChange, children }: ContextMenuRadioGroupProps) => (
  <MenuRadioGroupContext.Provider value={{ value, onValueChange }}>
    {children}
  </MenuRadioGroupContext.Provider>
);

const ContextMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: ContextMenuSubTriggerProps) => (
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

const ContextMenuSubContent = ({ className, children }: ContextMenuSubContentProps) => (
  <Popover>
    <Menu className={clsx(s.subPopup, className)} data-slot="context-menu-sub-content">
      {children}
    </Menu>
  </Popover>
);

const ContextMenuContent = ({ className, children, triggerRef }: ContextMenuContentProps) => (
  <Popover triggerRef={triggerRef}>
    <Menu className={clsx(s.popup, className)} data-slot="context-menu-content">
      {children}
    </Menu>
  </Popover>
);

const ContextMenuItem = ({
  className,
  inset,
  variant = 'default',
  onSelect,
  onClick,
  closeOnClick,
  ...props
}: ContextMenuItemProps) => {
  const handlers = mapMenuItemHandlers(onSelect, onClick, closeOnClick);

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
}: ContextMenuCheckboxItemProps) => (
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

const ContextMenuLabel = ({ className, inset, ...props }: ContextMenuLabelProps) => (
  <div
    className={clsx(s.label, className)}
    data-inset={inset}
    data-slot="context-menu-label"
    {...props}
  />
);

const ContextMenuSeparator = ({ className, ...props }: ComponentProps<typeof Separator>) => (
  <Separator
    className={clsx(s.separator, className)}
    data-slot="context-menu-separator"
    {...props}
  />
);

const ContextMenuShortcut = ({ className, ...props }: ComponentProps<'span'>) => (
  <span className={clsx(s.shortcut, className)} data-slot="context-menu-shortcut" {...props} />
);

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
