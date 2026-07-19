'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useTranslations } from 'next-intl';
import { isNullish } from 'remeda';
import { toast } from 'sonner';

import { useAppSettings } from '@/entities/app/settings';
import { appEvents, armPttStream, isTauriDesktop, toggleMicStream } from '@/shared/lib';

export const useShortcutActions = () => {
  const { localParticipant } = useLocalParticipant();
  const { settings } = useAppSettings();
  const t = useTranslations('room.shortcuts');

  const mode = settings.audio.activationMode;
  const enabled = isTauriDesktop() && !isNullish(localParticipant);

  appEvents.on.muteToggle(async () => {
    if (!enabled) {
      return;
    }

    try {
      const next = !localParticipant.isMicrophoneEnabled;
      await localParticipant.setMicrophoneEnabled(next);

      if (next) {
        appEvents.emit.micActivated();

        if (mode === 'pushToTalk') {
          armPttStream(localParticipant);
        }
      }
    } catch (err) {
      console.error('shortcut mute.toggle failed', err);
    }
  });

  appEvents.on.pttKey((payload) => {
    if (!enabled || mode !== 'pushToTalk') {
      return;
    }

    if (!localParticipant.isMicrophoneEnabled) {
      if (payload.phase === 'pressed') {
        toast.info(t('pttBlockedByMute'), { id: 'ptt-blocked-by-mute' });
      }
      return;
    }

    appEvents.emit.pttHold(payload);

    toggleMicStream(localParticipant, payload.phase === 'pressed');
  });
};
