'use client';

import { clsx } from 'clsx';
import { Menu, Popover } from 'react-aria-components';

import { useContextMenu } from '../../context-menu-context';

import s from '../../ContextMenu.module.scss';

import type { ContextMenuContentProps, ContextMenuSubContentProps } from '../../ContextMenu.types';

export const ContextMenuContent = ({ className, children }: ContextMenuContentProps) => {
  const context = useContextMenu();

  return (
    <Popover triggerRef={context?.triggerRef}>
      <Menu className={clsx(s.popup, className)} data-slot="context-menu-content">
        {children}
      </Menu>
    </Popover>
  );
};

export const ContextMenuSubContent = ({ className, children }: ContextMenuSubContentProps) => {
  return (
    <Popover>
      <Menu className={clsx(s.subPopup, className)} data-slot="context-menu-sub-content">
        {children}
      </Menu>
    </Popover>
  );
};
