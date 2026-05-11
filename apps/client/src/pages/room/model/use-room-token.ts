import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/user';
import { fetchLiveKitToken } from '@/shared/api';

interface CachedToken {
  token: string;
  url: string;
}

const readCache = (room: string): CachedToken | null => {
  const raw = sessionStorage.getItem(`solvex.room.${room}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CachedToken;
  } catch {
    return null;
  }
};

export const useRoomToken = (roomName: string) =>
  useQuery({
    queryKey: ['livekit-token', roomName],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async (): Promise<CachedToken> => {
      const cached = readCache(roomName);
      if (cached) return cached;

      const session = useAuthStore.getState().session;
      if (!session) throw new Error('Not authenticated');

      const result = await fetchLiveKitToken(
        { room: roomName, createIfMissing: false },
        session.access_token,
      );
      sessionStorage.setItem(
        `solvex.room.${roomName}`,
        JSON.stringify({ token: result.token, url: result.url }),
      );
      return { token: result.token, url: result.url };
    },
  });
