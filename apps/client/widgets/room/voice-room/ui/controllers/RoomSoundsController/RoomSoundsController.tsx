'use client';

import type { RoomSoundsControllerProps } from './RoomSoundsController.types';

import { useVoiceRoomSounds } from '../../../model/hooks';

export const RoomSoundsController = ({ roomId }: RoomSoundsControllerProps) => {
  useVoiceRoomSounds(roomId);

  return null;
};
