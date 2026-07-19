'use client';

import { useEffectEvent, useRef } from 'react';

import { getPublishDefaults, useAppSettings } from '@/entities/app/settings';
import { useRecentRooms } from '@/entities/room/room';
import { FAILURE_REASONS } from '../../../config';

import type { DisconnectReason } from 'livekit-client';
import type { UseRoomConnectionInput } from './use-room-connection.types';

export const useRoomConnection = ({
  roomId,
  onConnectFailure,
  onLeave,
}: UseRoomConnectionInput) => {
  const { settings } = useAppSettings();
  const { push: pushRecent } = useRecentRooms();

  const hasConnectedRef = useRef(false);

  const audioCaptureRef = useRef(settings.audio);
  const publishDefaultsRef = useRef(
    getPublishDefaults(settings.video.cameraQuality, settings.video.screenQuality),
  );

  const handleConnected = useEffectEvent(() => {
    hasConnectedRef.current = true;
    pushRecent(roomId);
  });

  const handleDisconnected = useEffectEvent((reason?: DisconnectReason) => {
    const hasConnected = hasConnectedRef.current;

    hasConnectedRef.current = false;

    if (hasConnected) {
      onLeave();

      return;
    }

    if (reason !== undefined && FAILURE_REASONS.has(reason)) {
      onConnectFailure(reason);
    }
  });

  return {
    audioCapture: audioCaptureRef.current,
    publishDefaults: publishDefaultsRef.current,
    handleConnected,
    handleDisconnected,
  };
};
