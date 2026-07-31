'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useEffect } from 'react';
import { isNullish } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { useTrayMenuItem } from '@/features/app/system-tray';
import { appEvents, isTauriDesktop } from '@/shared/lib';

import { toggleMicrophone } from '../../../lib';

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

    await toggleMicrophone({ localParticipant, isPtt, source: 'tray' });
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
