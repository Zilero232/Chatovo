'use client';

import { createContext, useContext } from 'react';

import type { ContextMenuContextValue } from './ContextMenu.types';

export const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

export const useContextMenu = () => {
  return useContext(ContextMenuContext);
};
