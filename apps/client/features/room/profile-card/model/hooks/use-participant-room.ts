'use client';

import { entries, find, isNullish, pipe } from 'remeda';

import { useRoomsPresence } from '@/entities/room/room';
import { useVoiceChannels } from '@/entities/server/channel';

export type ParticipantRoom = {
  roomId: string;
  roomName: string;
  serverId: string;
};

export const useParticipantRoom = (identity: string) => {
  const presence = useRoomsPresence();
  const { byId, isLoading } = useVoiceChannels();

  const entry = pipe(
    entries(presence),
    find(([, participants]) => participants.some((p) => p.identity === identity))
  );

  if (isNullish(entry)) {
    return { room: null, isLoading };
  }

  const [roomId] = entry;
  const channel = byId.get(roomId);

  if (isNullish(channel)) {
    return { room: null, isLoading };
  }

  return {
    room: { roomId, roomName: channel.name, serverId: channel.serverId } satisfies ParticipantRoom,
    isLoading
  };
};
