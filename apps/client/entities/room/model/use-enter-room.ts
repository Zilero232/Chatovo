import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { fetchLiveKitToken } from '@/shared/api';

export type EnterRoomInput = {
  room: string;
  accessToken: string;
  asAdmin?: boolean;
};

export const useEnterRoom = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ room, accessToken, asAdmin }: EnterRoomInput) => {
      const trimmed = room.trim();
      if (!trimmed) throw new Error('Room name required');
      if (!accessToken) throw new Error('Not authenticated');

      const { token, url } = await fetchLiveKitToken(
        { room: trimmed, createIfMissing: !!asAdmin },
        accessToken,
      );

      sessionStorage.setItem(`solvex.room.${trimmed}`, JSON.stringify({ token, url }));
      router.push(`/room?name=${encodeURIComponent(trimmed)}`);
    },
  });
};
