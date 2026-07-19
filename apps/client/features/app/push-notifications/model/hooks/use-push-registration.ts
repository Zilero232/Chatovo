'use client';

import { type as osType } from '@tauri-apps/plugin-os';
import { useEffect, useRef } from 'react';
import {
  checkPermissions,
  createChannel,
  getToken,
  onTokenRefresh,
  register,
  requestPermissions,
} from 'tauri-plugin-fcm';

import { registerPushDevice, unregisterPushDevice } from '@/shared/api';
import { isTauriMobile } from '@/shared/lib';

import type { PushPlatform } from '@chatovo/schemas';

const CHANNELS = [
  { id: 'messages', name: 'Messages', importance: 4 },
  { id: 'calls', name: 'Calls', importance: 5 },
] as const;

const resolvePlatform = (): PushPlatform | null => {
  const type = osType();

  if (type === 'android' || type === 'ios') {
    return type;
  }

  return null;
};

export const usePushRegistration = (enabled: boolean): void => {
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !isTauriMobile()) {
      return;
    }

    const platform = resolvePlatform();

    if (!platform) {
      return;
    }

    let tokenListener: Awaited<ReturnType<typeof onTokenRefresh>> | null = null;
    let cancelled = false;

    const setup = async () => {
      for (const channel of CHANNELS) {
        await createChannel(channel);
      }

      let permission = await checkPermissions();

      if (permission !== 'granted') {
        permission = await requestPermissions();
      }

      if (permission !== 'granted') {
        console.warn('[push] notification permission not granted:', permission);

        return;
      }

      if (cancelled) {
        return;
      }

      await register();

      const { token } = await getToken();

      if (cancelled) {
        return;
      }

      if (!token) {
        console.warn('[push] FCM returned an empty token');

        return;
      }

      tokenRef.current = token;
      await registerPushDevice({ token, platform });

      tokenListener = await onTokenRefresh(async (event) => {
        tokenRef.current = event.token;

        try {
          await registerPushDevice({ token: event.token, platform });
        } catch (error) {
          console.error('[push] failed to persist refreshed token', error);
        }
      });
    };

    setup().catch((error: unknown) => {
      console.error('[push] registration failed', error);
    });

    return () => {
      cancelled = true;
      void tokenListener?.unregister();

      const token = tokenRef.current;
      tokenRef.current = null;

      if (token) {
        unregisterPushDevice({ token }).catch(() => {});
      }
    };
  }, [enabled]);
};
