import { isTauriMobile } from './tauri-platform';

export const isScreenShareSupported = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (isTauriMobile()) {
    return false;
  }

  if (window.matchMedia('(pointer: coarse)').matches) {
    return false;
  }

  return typeof navigator.mediaDevices?.getDisplayMedia === 'function';
};
