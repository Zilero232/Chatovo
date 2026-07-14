'use client';

import { platform } from '@tauri-apps/plugin-os';
import { useState } from 'react';

import { isTauriDesktop } from '@/shared/lib';

import type { Platform } from '@tauri-apps/plugin-os';

export const useWindowPlatform = () => {
  const [os] = useState<Platform | null>(() => (isTauriDesktop() ? platform() : null));

  return os;
};
