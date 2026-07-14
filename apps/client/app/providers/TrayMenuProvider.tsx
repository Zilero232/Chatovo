'use client';

import { trayMenuContext, useCloseOnWindowEvent, useTraySetup } from '@/features/app/system-tray';
import { isTauriDesktop } from '@/shared/lib';

import type { ReactNode } from 'react';

const TrayBridge = ({ children }: { children: ReactNode }) => {
  const tray = useTraySetup();

  useCloseOnWindowEvent();

  const contextValue = { value: tray, set: () => {} };

  return (
    <trayMenuContext.instance.Provider value={contextValue}>
      {children}
    </trayMenuContext.instance.Provider>
  );
};

export const TrayMenuProvider = ({ children }: { children: ReactNode }) => {
  if (!isTauriDesktop()) {
    return <>{children}</>;
  }

  return <TrayBridge>{children}</TrayBridge>;
};
