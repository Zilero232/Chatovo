'use client';

import type { Channel } from '@chatovo/schemas';

import { useMutation } from '@tanstack/react-query';

import { useToastError } from '@/entities/app/locale';
import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { useRoomSession } from '@/entities/room/session';
import { fetchLiveKitToken } from '@/shared/api';

/**
 * Joins a voice channel in place: the call opens in the session host next to
 * the page, so the server view stays where it is, like Discord's voice bar.
 */
export const useJoinVoiceChannel = () => {
  const toastError = useToastError();

  const { isAdmin } = useCurrentUser();
  const { settings } = useAppSettings();
  const { session, open, close, rejoin } = useRoomSession();

  const invisible = isAdmin && settings.system.invisibleMode;

  const joinMutation = useMutation({
    mutationFn: async (channel: Channel) => {
      const { token } = await fetchLiveKitToken({ roomId: channel.id, invisible });

      return { channel, token };
    },
    onSuccess: ({ channel, token }) => {
      rejoin();
      open({
        roomId: channel.id,
        roomName: channel.name,
        token,
        isChatOpen: false,
        isDm: false,
        isInvisible: invisible,
        serverId: channel.serverId
      });
    },
    onError: (error: Error, channel) => {
      toastError(`voice-join-${channel.id}`)(error);
    }
  });

  const join = (channel: Channel) => {
    if (session?.roomId === channel.id) {
      return;
    }

    joinMutation.mutate(channel);
  };

  const leave = () => {
    close();
  };

  return {
    join,
    leave,
    activeChannelId: session?.roomId ?? null,
    isPending: joinMutation.isPending
  };
};
