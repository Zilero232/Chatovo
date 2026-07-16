'use client';

import { createContext, useContext } from 'react';

import type { MenuRadioGroupContextValue } from './menu-types';

export const MenuRadioGroupContext = createContext<MenuRadioGroupContextValue | null>(null);

export const useMenuRadioGroup = () => {
  return useContext(MenuRadioGroupContext);
};
