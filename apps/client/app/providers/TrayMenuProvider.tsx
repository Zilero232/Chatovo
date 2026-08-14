'use client';

import type { ReactNode } from 'react';

import { TrayMenuContext, useCloseOnWindowEvent, useTraySetup } from '@/features/app/system-tray';
import { isTauriDesktop } from '@/shared/lib';

const TrayBridge = ({ children }: { children: ReactNode }) => {
  const tray = useTraySetup();

  useCloseOnWindowEvent();

  const contextValue = { value: tray, set: () => {} };

  return (
    <TrayMenuContext.instance.Provider value={contextValue}>
      {children}
    </TrayMenuContext.instance.Provider>
  );
};

export const TrayMenuProvider = ({ children }: { children: ReactNode }) => {
  if (!isTauriDesktop()) {
    return <>{children}</>;
  }

  return <TrayBridge>{children}</TrayBridge>;
};
