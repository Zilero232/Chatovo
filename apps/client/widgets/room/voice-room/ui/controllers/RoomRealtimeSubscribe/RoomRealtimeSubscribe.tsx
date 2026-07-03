'use client';

import { useRealtimeSubscribe } from '@/entities/app/realtime';
import type { RoomRealtimeSubscribeProps } from './RoomRealtimeSubscribe.types';

export const RoomRealtimeSubscribe = ({ roomId }: RoomRealtimeSubscribeProps) => {
  useRealtimeSubscribe([roomId]);

  return null;
};
