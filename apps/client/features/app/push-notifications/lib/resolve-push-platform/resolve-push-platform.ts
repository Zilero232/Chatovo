import type { PushPlatform } from '@chatovo/schemas';

import { type as osType } from '@tauri-apps/plugin-os';

/** Returns `null` on every platform that cannot receive FCM pushes (desktop, web). */
export const resolvePushPlatform = (): PushPlatform | null => {
  const type = osType();

  if (type === 'android' || type === 'ios') {
    return type;
  }

  return null;
};
