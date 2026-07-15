'use client';

import { useState } from 'react';

import { useAppSettings } from '@/entities/app/settings';
import { appEvents } from '@/shared/lib';

export type PttState = 'off' | 'idle' | 'active';

export const usePttActive = (): PttState => {
  const [held, setHeld] = useState(false);

  const { settings } = useAppSettings();

  appEvents.on.pttHold((payload) => {
    setHeld(payload.phase === 'pressed');
  });

  if (settings.audio.activationMode !== 'pushToTalk') {
    return 'off';
  }

  return held ? 'active' : 'idle';
};
