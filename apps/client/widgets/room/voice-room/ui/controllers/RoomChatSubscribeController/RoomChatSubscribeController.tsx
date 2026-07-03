'use client';

import { useRealtimeSubscribe } from '@/entities/app/realtime';

type RoomChatSubscribeControllerProps = {
  roomId: string;
};

export const RoomChatSubscribeController = ({ roomId }: RoomChatSubscribeControllerProps) => {
  useRealtimeSubscribe([roomId]);

  return null;
};
