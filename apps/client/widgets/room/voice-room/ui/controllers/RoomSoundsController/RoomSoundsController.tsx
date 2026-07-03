'use client';

import { useVoiceRoomSounds } from '../../../model/hooks';

type RoomSoundsControllerProps = {
  roomId: string;
};

export const RoomSoundsController = ({ roomId }: RoomSoundsControllerProps) => {
  useVoiceRoomSounds(roomId);

  return null;
};
