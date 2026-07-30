'use client';

import type { TrayItems } from '../../lib/build-tray-menu';

import { useTrayMenu } from '../tray-menu-context';

export const useTrayMenuItem = <K extends keyof TrayItems>(key: K): TrayItems[K] | null => {
  const tray = useTrayMenu();

  return tray?.items[key] ?? null;
};
