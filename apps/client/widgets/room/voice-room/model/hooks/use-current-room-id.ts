'use client';

import { useRoomContext } from '@livekit/components-react';

export const useCurrentRoomId = () => useRoomContext().name;
