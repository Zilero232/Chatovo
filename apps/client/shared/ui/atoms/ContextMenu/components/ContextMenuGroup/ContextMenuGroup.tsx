'use client';

import { MenuSection, SubmenuTrigger } from 'react-aria-components';

import { MenuRadioGroupContext } from '../../../../lib/menu-radio-group-context';

import type {
  ContextMenuGroupProps,
  ContextMenuPortalProps,
  ContextMenuRadioGroupProps,
  ContextMenuSubProps,
} from '../../ContextMenu.types';

export const ContextMenuGroup = ({ className, children, ...props }: ContextMenuGroupProps) => {
  return (
    <MenuSection className={className} data-slot="context-menu-group" {...props}>
      {children}
    </MenuSection>
  );
};

export const ContextMenuPortal = ({ children }: ContextMenuPortalProps) => {
  return <>{children}</>;
};

export const ContextMenuSub = ({ children, ...props }: ContextMenuSubProps) => {
  return (
    <SubmenuTrigger data-slot="context-menu-sub" {...props}>
      {children}
    </SubmenuTrigger>
  );
};

export const ContextMenuRadioGroup = ({
  value,
  onValueChange,
  children,
}: ContextMenuRadioGroupProps) => {
  return (
    <MenuRadioGroupContext.Provider value={{ value, onValueChange }}>
      {children}
    </MenuRadioGroupContext.Provider>
  );
};
