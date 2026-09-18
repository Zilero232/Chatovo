'use client';

import type { DisconnectReason } from 'livekit-client';

import { useRef } from 'react';

import { getPublishDefaults, useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';

import type { UseRoomConnectionInput } from './use-room-connection.types';

import { FAILURE_REASONS } from '../../../config';

export const useRoomConnection = ({ onConnectFailure, onLeave }: UseRoomConnectionInput) => {
  const { settings } = useAppSettings();
  const { isAdmin } = useCurrentUser();

  const isInvisible = isAdmin && settings.system.invisibleMode;

  const hasConnectedRef = useRef(false);

  const audioCaptureRef = useRef(settings.audio);
  const publishDefaultsRef = useRef(
    getPublishDefaults(settings.video.cameraQuality, settings.video.screenQuality)
  );

  const handleConnected = () => {
    hasConnectedRef.current = true;
  };

  const handleDisconnected = (reason?: DisconnectReason) => {
    const hasConnected = hasConnectedRef.current;

    hasConnectedRef.current = false;

    if (hasConnected) {
      onLeave();

      return;
    }

    if (reason !== undefined && FAILURE_REASONS.has(reason)) {
      onConnectFailure(reason);
    }
  };

  return {
    isInvisible,
    audioCapture: isInvisible ? false : audioCaptureRef.current,
    publishDefaults: publishDefaultsRef.current,
    handleConnected,
    handleDisconnected
  };
};
