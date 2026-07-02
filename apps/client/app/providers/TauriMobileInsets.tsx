'use client';

import { useEffect } from 'react';
import { isTauriMobile } from '@/shared/lib';

export const TauriMobileInsets = () => {
  useEffect(() => {
    if (!isTauriMobile()) {
      return;
    }

    document.documentElement.classList.add('tauri-mobile');

    return () => {
      document.documentElement.classList.remove('tauri-mobile');
    };
  }, []);

  return null;
};
