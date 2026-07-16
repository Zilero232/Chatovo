'use client';

import { useRef, useState } from 'react';
import { MenuTrigger } from 'react-aria-components';

import { ContextMenuContext } from '../../context-menu-context';

import type { ContextMenuProps } from '../../ContextMenu.types';

export const ContextMenu = ({ children }: ContextMenuProps) => {
  const [isOpen, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <ContextMenuContext.Provider value={{ triggerRef, isOpen, setOpen }}>
      <MenuTrigger data-slot="context-menu" isOpen={isOpen} onOpenChange={setOpen}>
        {children}
      </MenuTrigger>
    </ContextMenuContext.Provider>
  );
};
