'use client';

import { useEffect } from 'react';
import { isTauriMobile } from '@/shared/lib';

const syncInsetsFromPlugin = async () => {
  const api = await import('@saurl/tauri-plugin-safe-area-insets-css-api');
  const [top, bottom] = await Promise.all([api.getTopInset(), api.getBottomInset()]);

  const root = document.documentElement;

  if (top?.inset != null) {
    root.style.setProperty('--safe-area-inset-top', `${top.inset}px`);
  }

  if (bottom?.inset != null) {
    root.style.setProperty('--safe-area-inset-bottom', `${bottom.inset}px`);
  }
};

export const TauriMobileInsets = () => {
  useEffect(() => {
    if (!isTauriMobile()) {
      return;
    }

    const root = document.documentElement;
    root.classList.add('tauri-mobile');

    void import('@saurl/tauri-plugin-safe-area-insets-css-api').then(() => syncInsetsFromPlugin());

    const onResize = () => {
      void syncInsetsFromPlugin();
    };

    window.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('resize', onResize);

    return () => {
      root.classList.remove('tauri-mobile');
      root.style.removeProperty('--safe-area-inset-top');
      root.style.removeProperty('--safe-area-inset-bottom');
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
    };
  }, []);

  return null;
};
