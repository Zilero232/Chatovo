'use client';

import { createContext, useContext } from 'react';

import type { SheetAnimationState } from './Sheet.types';

export const SheetAnimationContext = createContext<SheetAnimationState>('unmounted');

export const useSheetAnimation = () => {
  return useContext(SheetAnimationContext);
};
