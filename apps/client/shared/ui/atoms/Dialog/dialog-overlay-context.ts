'use client';

import { createContext, useContext } from 'react';

import type { DialogOverlayContextValue } from './Dialog.types';

export const DialogOverlayContext = createContext<DialogOverlayContextValue | null>(null);

export const useDialogOverlay = () => {
  return useContext(DialogOverlayContext);
};
