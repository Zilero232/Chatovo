'use client';

import { useLocalParticipant } from '@livekit/components-react';

import { useAppSettings } from '@/entities/app/settings';
import { armPttStream, isTauriDesktop, prettyHotkey } from '@/shared/lib';
import { resolveMicVisual } from '../../lib/mic-visual';
import { useDeafen } from './use-deafen';
import { useParticipantAction } from './use-participant-action';
import { usePttActive } from './use-ptt-active';

export const useMicControl = () => {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const { settings } = useAppSettings();

  const { isDeafened, undeafen } = useDeafen();
  const pttState = usePttActive();

  const isPtt = settings.audio.activationMode === 'pushToTalk';
  const pttBinding = settings.shortcuts.pttHold;

  const visual = resolveMicVisual(pttState, isMicrophoneEnabled);

  const { run, isPending } = useParticipantAction(localParticipant, async (participant) => {
    const next = !participant.isMicrophoneEnabled;

    await participant.setMicrophoneEnabled(next);

    if (!next) {
      return;
    }

    if (isDeafened) {
      undeafen();
    }

    if (isPtt) {
      armPttStream(participant);
    }
  });

  return {
    ...visual,
    pttKey: isPtt && isTauriDesktop() && pttBinding ? prettyHotkey(pttBinding) : undefined,
    isPending,
    toggle: run,
  };
};
