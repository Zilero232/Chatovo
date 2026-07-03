'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useAsyncEffect } from '@siberiacancode/reactuse';
import { isNullish } from 'remeda';
import { useAppSettings } from '@/entities/app/settings';
import { toggleMicStream } from '@/shared/lib';

export const useMicActivationMode = () => {
  const { settings } = useAppSettings();
  const { localParticipant } = useLocalParticipant();

  const mode = settings.audio.activationMode;

  useAsyncEffect(async () => {
    if (isNullish(localParticipant) || !localParticipant.isMicrophoneEnabled) {
      return;
    }
    if (mode !== 'pushToTalk') {
      return;
    }

    try {
      await localParticipant.setMicrophoneEnabled(true);

      toggleMicStream(localParticipant, false);
    } catch (err) {
      console.error('mic activation: PTT init failed', err);
    }
  }, [mode, localParticipant]);
};
