'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useEffect, useRef } from 'react';
import useSound from 'use-sound';

export const RoomSounds = () => {
  const { isScreenShareEnabled } = useLocalParticipant();
  const prevScreenShare = useRef<boolean | null>(null);
  const [playOn] = useSound('/sounds/screenshare-on.wav', { volume: 0.5 });
  const [playOff] = useSound('/sounds/screenshare-off.wav', { volume: 0.5 });

  useEffect(() => {
    if (prevScreenShare.current === null) {
      prevScreenShare.current = isScreenShareEnabled;
      return;
    }
    if (prevScreenShare.current === isScreenShareEnabled) return;
    if (isScreenShareEnabled) playOn();
    else playOff();
    prevScreenShare.current = isScreenShareEnabled;
  }, [isScreenShareEnabled, playOn, playOff]);

  return null;
};
