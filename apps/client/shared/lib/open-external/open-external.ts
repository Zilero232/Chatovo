import { isTauri } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';

const openInBrowser = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const openExternal = async (url: string): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!isTauri()) {
    openInBrowser(url);

    return;
  }

  try {
    await openUrl(url);
  } catch {
    openInBrowser(url);
  }
};
