'use client';

import { createContext } from '@siberiacancode/reactuse';

import type { TrayMenuValue } from './hooks/use-tray-setup';

export const TrayMenuContext = createContext<TrayMenuValue | null>(null, { name: 'TrayMenu' });

export const useTrayMenu = (): TrayMenuValue | null => TrayMenuContext.useSelect().value ?? null;
