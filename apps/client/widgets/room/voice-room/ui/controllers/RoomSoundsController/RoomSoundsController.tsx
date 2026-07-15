'use client';

import { useVoiceRoomSounds } from '../../../model/hooks';

import type { RoomSoundsControllerProps } from './RoomSoundsController.types';

export const RoomSoundsController = ({ roomId }: RoomSoundsControllerProps) => {
  useVoiceRoomSounds(roomId);

  return null;
};
