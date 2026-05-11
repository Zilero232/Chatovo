import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { fetchLiveKitToken } from '@/shared/api';

export interface EnterRoomInput {
  room: string;
  accessToken: string;
  asAdmin?: boolean;
}

export const useEnterRoom = () => {
  const navigate = useNavigate();

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
      navigate({ to: '/room/$name', params: { name: trimmed } });
    },
  });
};
