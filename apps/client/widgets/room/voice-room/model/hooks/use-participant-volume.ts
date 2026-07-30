'use client';

import type { Participant } from 'livekit-client';

import { useDebounceCallback, useLocalStorage } from '@siberiacancode/reactuse';
import { RemoteParticipant } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import { clamp, defaultTo, omit } from 'remeda';

import { STORAGE_KEYS } from '@/shared/constants';

const MAX_VOLUME = 1;
const DEFAULT_VOLUME = 1;

const PERSIST_DELAY_MS = 300;

type VolumeMap = Record<string, number>;

const readVolumes = (): VolumeMap => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.participantVolumes) ?? '{}');
  } catch {
    return {};
  }
};

type ParticipantVolume = {
  isControllable: boolean;
  isMuted: boolean;
  volume: number;
  setVolume: (next: number) => void;
  toggleMute: () => void;
};

const clampVolume = (value: number) => clamp(value, { min: 0, max: MAX_VOLUME });

export const useParticipantVolume = (participant: Participant): ParticipantVolume => {
  const { identity } = participant;
  const isControllable = participant instanceof RemoteParticipant;

  const { value, set: setVolumes } = useLocalStorage<VolumeMap>(
    STORAGE_KEYS.participantVolumes,
    {}
  );

  const volumes = defaultTo(value, {} as VolumeMap);

  const [volume, setVolumeState] = useState(() => volumes[identity] ?? DEFAULT_VOLUME);

  const volumeBeforeMute = useRef(DEFAULT_VOLUME);

  const persist = useDebounceCallback((targetIdentity: string, next: number) => {
    const stored = readVolumes();

    setVolumes(
      next === DEFAULT_VOLUME
        ? omit(stored, [targetIdentity])
        : { ...stored, [targetIdentity]: next }
    );
  }, PERSIST_DELAY_MS);

  const apply = (next: number) => {
    const clamped = clampVolume(next);

    setVolumeState(clamped);
    persist(identity, clamped);

    if (participant instanceof RemoteParticipant) {
      participant.setVolume(clamped);
    }
  };

  const setVolume = (next: number) => {
    if (next > 0) {
      volumeBeforeMute.current = next;
    }

    apply(next);
  };

  const toggleMute = () => {
    if (volume > 0) {
      volumeBeforeMute.current = volume;
      apply(0);

      return;
    }

    apply(volumeBeforeMute.current || DEFAULT_VOLUME);
  };

  useEffect(() => {
    if (participant instanceof RemoteParticipant) {
      participant.setVolume(clampVolume(volume));
    }
  }, [participant, volume]);

  return {
    volume,
    isControllable,
    isMuted: volume === 0,
    setVolume,
    toggleMute
  };
};
