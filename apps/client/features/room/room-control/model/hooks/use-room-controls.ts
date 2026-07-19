'use client';

import { useRoomContext } from '@livekit/components-react';

import { useCameraControl } from './use-camera-control';
import { useDeafen } from './use-deafen';
import { useMicControl } from './use-mic-control';
import { useScreenControl } from './use-screen-control';

export const useRoomControls = () => {
  const room = useRoomContext();

  const { isDeafened, toggle: toggleDeafen } = useDeafen();

  return {
    mic: useMicControl(),
    camera: useCameraControl(),
    screen: useScreenControl(),
    deafen: { active: isDeafened, toggle: toggleDeafen },
    leave: () => room.disconnect(),
  };
};
