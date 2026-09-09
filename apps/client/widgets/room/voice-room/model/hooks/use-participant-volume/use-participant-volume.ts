'use client';

import type { Participant } from 'livekit-client';

import { useDebounceCallback, useLocalStorage } from '@siberiacancode/reactuse';
import { RemoteParticipant, Track } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import { defaultTo, omit } from 'remeda';

import { STORAGE_KEYS } from '@/shared/constants';
import { readStoredJson } from '@/shared/lib';

import type { VolumeMap, VolumeSource } from '../../../lib';
import type { ParticipantVolume } from './use-participant-volume.types';

import { DEFAULT_VOLUME, VOLUME_PERSIST_DELAY_MS } from '../../../config';
import { buildVolumeStorageKey, capVolumes, clampVolume } from '../../../lib';

const readVolumes = (): VolumeMap => readStoredJson<VolumeMap>(STORAGE_KEYS.participantVolumes, {});

export const useParticipantVolume = (
  participant: Participant,
  source: VolumeSource = Track.Source.Microphone
): ParticipantVolume => {
  const storageKey = buildVolumeStorageKey(participant.identity, source);
  const isControllable = participant instanceof RemoteParticipant;

  const { value, set: setVolumes } = useLocalStorage<VolumeMap>(
    STORAGE_KEYS.participantVolumes,
    {}
  );

  const volumes = defaultTo(value, {} as VolumeMap);

  const [volume, setVolume] = useState(() => volumes[storageKey] ?? DEFAULT_VOLUME);

  const volumeBeforeMuteRef = useRef(DEFAULT_VOLUME);

  const persist = useDebounceCallback((targetKey: string, next: number) => {
    const stored = readVolumes();

    setVolumes(
      next === DEFAULT_VOLUME
        ? omit(stored, [targetKey])
        : capVolumes({ ...omit(stored, [targetKey]), [targetKey]: next })
    );
  }, VOLUME_PERSIST_DELAY_MS);

  const apply = (next: number) => {
    const clamped = clampVolume(next);

    setVolume(clamped);
    persist(storageKey, clamped);

    if (participant instanceof RemoteParticipant) {
      participant.setVolume(clamped, source);
    }
  };

  const changeVolume = (next: number) => {
    if (next > 0) {
      volumeBeforeMuteRef.current = next;
    }

    apply(next);
  };

  const toggleMute = () => {
    if (volume > 0) {
      volumeBeforeMuteRef.current = volume;
      apply(0);

      return;
    }

    apply(volumeBeforeMuteRef.current || DEFAULT_VOLUME);
  };

  useEffect(() => {
    if (participant instanceof RemoteParticipant) {
      participant.setVolume(clampVolume(volume), source);
    }
  }, [participant, source, volume]);

  return {
    volume,
    isControllable,
    isMuted: volume === 0,
    setVolume: changeVolume,
    toggleMute
  };
};
