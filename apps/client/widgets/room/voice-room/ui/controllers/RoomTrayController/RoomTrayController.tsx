'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useEffect } from 'react';
import { isNullish } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { useTrayMenuItem } from '@/features/app/system-tray';
import { appEvents, isTauriDesktop, toggleMicStream } from '@/shared/lib';

export const RoomTrayController = () => {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const muteItem = useTrayMenuItem('mute');
  const { settings } = useAppSettings();

  const isPtt = settings.audio.activationMode === 'pushToTalk';
  const active = isTauriDesktop() && !isNullish(localParticipant);

  appEvents.on.trayMuteToggle(async () => {
    if (!active) {
      return;
    }

    try {
      const next = !localParticipant.isMicrophoneEnabled;
      await localParticipant.setMicrophoneEnabled(next);

      if (next) {
        appEvents.emit.micActivated();
      }
      if (isPtt && next) {
        toggleMicStream(localParticipant, false);
      }
    } catch (err) {
      console.error('tray mute toggle failed', err);
    }
  });

  useEffect(() => {
    if (isNullish(muteItem)) {
      return;
    }

    const next = isPtt ? false : !isMicrophoneEnabled;

    (async () => {
      try {
        await muteItem.setChecked(next);
      } catch (err) {
        console.error('tray mute setChecked failed', err);
      }
    })();
  }, [muteItem, isMicrophoneEnabled, isPtt]);

  return null;
};
