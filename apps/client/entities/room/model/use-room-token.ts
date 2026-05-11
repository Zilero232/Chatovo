import { useQuery } from '@tanstack/react-query';

import { fetchLiveKitToken } from '@/shared/api';

type CachedToken = {
  token: string;
  url: string;
};

type Params = {
  roomName: string | null;
  accessToken: string | null;
};

const readCache = (room: string): CachedToken | null => {
  const raw = sessionStorage.getItem(`solvex.room.${room}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CachedToken;
  } catch {
    return null;
  }
};

export const useRoomToken = ({ roomName, accessToken }: Params) =>
  useQuery({
    queryKey: ['livekit-token', roomName],
    enabled: !!roomName && !!accessToken,
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async (): Promise<CachedToken> => {
      if (!roomName) throw new Error('Room name required');
      if (!accessToken) throw new Error('Not authenticated');

      const cached = readCache(roomName);
      if (cached) return cached;

      const result = await fetchLiveKitToken(
        { room: roomName, createIfMissing: false },
        accessToken,
      );
      sessionStorage.setItem(
        `solvex.room.${roomName}`,
        JSON.stringify({ token: result.token, url: result.url }),
      );
      return { token: result.token, url: result.url };
    },
  });
