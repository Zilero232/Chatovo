'use client';

import { clsx } from 'clsx';
import { Menu, Popover } from 'react-aria-components';

import { placementFromSideAlign } from '../../../../lib/placement';

import s from '../../DropdownMenu.module.scss';

import type {
  DropdownMenuContentProps,
  DropdownMenuSubContentProps,
} from '../../DropdownMenu.types';

export const DropdownMenuContent = ({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  children,
  onClick,
}: DropdownMenuContentProps) => {
  return (
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
};

export const DropdownMenuSubContent = ({ className, children }: DropdownMenuSubContentProps) => {
  return (
    <Popover>
      <Menu
        className={clsx('glass-overlay', s.subPopup, className)}
        data-slot="dropdown-menu-sub-content"
      >
        {children}
      </Menu>
    </Popover>
  );
};
