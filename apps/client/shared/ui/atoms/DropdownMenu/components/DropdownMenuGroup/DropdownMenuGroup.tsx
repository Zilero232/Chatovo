'use client';

import { MenuSection, SubmenuTrigger } from 'react-aria-components';

import { MenuRadioGroupContext } from '../../../../lib/menu-radio-group-context';

import type {
  DropdownMenuGroupProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuSubProps,
} from '../../DropdownMenu.types';

export const DropdownMenuGroup = ({ className, children, ...props }: DropdownMenuGroupProps) => {
  return (
    <MenuSection className={className} data-slot="dropdown-menu-group" {...props}>
      {children}
    </MenuSection>
  );
};

export const DropdownMenuRadioGroup = ({
  value,
  onValueChange,
  className,
  children,
}: DropdownMenuRadioGroupProps) => {
  return (
    <MenuSection className={className} data-slot="dropdown-menu-radio-group">
      <MenuRadioGroupContext.Provider value={{ value, onValueChange }}>
        {children}
      </MenuRadioGroupContext.Provider>
    </MenuSection>
  );
};

export const DropdownMenuSub = ({ children, ...props }: DropdownMenuSubProps) => {
  return (
    <SubmenuTrigger data-slot="dropdown-menu-sub" {...props}>
      {children}
    </SubmenuTrigger>
  );
};
