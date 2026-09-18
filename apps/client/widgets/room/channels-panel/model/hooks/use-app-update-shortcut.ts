'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { appEvents } from '@/shared/lib';

/** Drives the update and download rows: the check runs through the app bus, the dialog locally. */
export const useAppUpdateShortcut = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloadOpen, toggleDownload] = useBoolean(false);

  appEvents.on.recheckUpdate(() => setIsChecking(true));
  appEvents.on.updateCheckSettled(() => setIsChecking(false));

  return {
    isChecking,
    isDownloadOpen,
    toggleDownload,
    checkUpdate: () => appEvents.emit.recheckUpdate()
  };
};
