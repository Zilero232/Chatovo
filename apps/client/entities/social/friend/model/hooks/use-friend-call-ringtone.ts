'use client';

import { useEffect, useRef } from 'react';
import { useAppSettings } from '@/entities/app/settings';
import { FRIEND_CALL_SOUND_SRC, type FriendCallSoundKind } from '../../config/call-sounds';

export const useFriendCallRingtone = (active: boolean, kind: FriendCallSoundKind) => {
  const { settings } = useAppSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { enabled: soundsEnabled, volume } = settings.sounds;

  useEffect(() => {
    const audio = new Audio(FRIEND_CALL_SOUND_SRC[kind]);
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [kind]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!active || !soundsEnabled.call) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    audio.volume = volume;
    audio.play().catch(() => {});
  }, [active, soundsEnabled.call, volume]);
};
