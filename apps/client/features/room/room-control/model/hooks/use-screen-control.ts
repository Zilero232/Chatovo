'use client';

import { useLocalParticipant } from '@livekit/components-react';

import { getScreenCaptureOptions, useAppSettings } from '@/entities/app/settings';
import { useParticipantAction } from './use-participant-action';

export const useScreenControl = () => {
  const { localParticipant, isScreenShareEnabled } = useLocalParticipant();
  const { settings } = useAppSettings();

  const { run, isPending } = useParticipantAction(localParticipant, (participant) =>
    participant.setScreenShareEnabled(
      !participant.isScreenShareEnabled,
      getScreenCaptureOptions(settings.video.screenQuality),
    ),
  );

  return { enabled: isScreenShareEnabled, isPending, toggle: run };
};
