'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';

import { STORAGE_KEYS } from '@/shared/constants';

type LastChannelMap = Record<string, string>;

export const useLastChannel = (serverId: string | null) => {
  const { value, set } = useLocalStorage<LastChannelMap>(STORAGE_KEYS.lastChannelByServer, {});

  const lastChannelId = serverId ? (value?.[serverId] ?? null) : null;

  const rememberChannel = (channelId: string) => {
    if (!serverId) {
      return;
    }

    set({ ...(value ?? {}), [serverId]: channelId });
  };

  return { lastChannelId, rememberChannel };
};
