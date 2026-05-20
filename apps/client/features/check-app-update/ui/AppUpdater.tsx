'use client';

import { useCheckAppUpdate } from '../model/use-check-app-update';

export const AppUpdater = () => {
  useCheckAppUpdate();

  return null;
};
