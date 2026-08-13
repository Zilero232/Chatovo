'use client';

import { useCurrentRoomId, useVoiceRoomSounds } from '../../../model/hooks';

export const RoomSoundsController = () => {
  const roomId = useCurrentRoomId();

  useVoiceRoomSounds(roomId);

  return null;
};
