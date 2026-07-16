'use client';

import { MenuTrigger } from 'react-aria-components';

import { Button } from '../../../Button';

import type {
  DropdownMenuPortalProps,
  DropdownMenuProps,
  DropdownMenuTriggerProps,
} from '../../DropdownMenu.types';

export const DropdownMenu = ({ children, ...props }: DropdownMenuProps) => {
  return (
    <MenuTrigger data-slot="dropdown-menu" {...props}>
      {children}
    </MenuTrigger>
  );
};

export const DropdownMenuPortal = ({ children }: DropdownMenuPortalProps) => {
  return <>{children}</>;
};

export const DropdownMenuTrigger = ({ className, ...props }: DropdownMenuTriggerProps) => {
  return <Button className={className} data-slot="dropdown-menu-trigger" {...props} />;
};
