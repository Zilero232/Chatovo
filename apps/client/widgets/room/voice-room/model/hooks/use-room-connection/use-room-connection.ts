'use client';

import { useRef } from 'react';

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

  const handleConnected = () => {
    hasConnectedRef.current = true;
    pushRecent(roomId);
  };

  const handleDisconnected = (reason?: DisconnectReason) => {
    if (!hasConnectedRef.current) {
      if (reason !== undefined && FAILURE_REASONS.has(reason)) {
        onConnectFailure(reason);
      }

      return;
    }

    onLeave();
  };

  return {
    audioCapture: audioCaptureRef.current,
    publishDefaults: publishDefaultsRef.current,
    handleConnected,
    handleDisconnected,
  };
};
