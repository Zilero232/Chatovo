'use client';

import type { Participant } from 'livekit-client';

import { useParticipantTracks } from '@livekit/components-react';
import { createAudioAnalyser, LocalAudioTrack, RemoteAudioTrack, Track } from 'livekit-client';
import { useEffect, useRef } from 'react';
import { clamp } from 'remeda';

import { isTauriMobile } from '@/shared/lib';

const ANALYSER_OPTIONS = { fftSize: 32, smoothingTimeConstant: 0.4 } as const;

const FRAME_INTERVAL_MS = 1_000 / 30;
const LITE_FRAME_INTERVAL_MS = 1_000 / 15;

const NOISE_FLOOR = 0.06;
const LEVEL_GAIN = 2.6;
const ATTACK = 0.5;
const RELEASE = 0.12;

const readLevel = (analyser: AnalyserNode, bins: Uint8Array<ArrayBuffer>): number => {
  analyser.getByteFrequencyData(bins);

  let sum = 0;

  for (const bin of bins) {
    sum += bin * bin;
  }

  const rms = Math.sqrt(sum / bins.length) / 255;

  return clamp((rms - NOISE_FLOOR) * LEVEL_GAIN, { min: 0, max: 1 });
};

export const useParticipantAudioLevel = <T extends HTMLElement>(participant: Participant) => {
  const ref = useRef<T>(null);

  const [micTrack] = useParticipantTracks([Track.Source.Microphone], participant.identity);

  const track = micTrack?.publication.track;

  useEffect(() => {
    const node = ref.current;

    if (
      !node ||
      !(track instanceof LocalAudioTrack || track instanceof RemoteAudioTrack) ||
      !track.mediaStream
    ) {
      return;
    }

    const { analyser, cleanup } = createAudioAnalyser(track, ANALYSER_OPTIONS);
    const bins = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    const interval = isTauriMobile() ? LITE_FRAME_INTERVAL_MS : FRAME_INTERVAL_MS;

    let frameId: number | null = null;
    let lastFrameAt = 0;
    let smoothed = 0;

    const tick = (now: number) => {
      frameId = requestAnimationFrame(tick);

      if (now - lastFrameAt < interval) {
        return;
      }

      lastFrameAt = now;

      const level = readLevel(analyser, bins);

      smoothed += (level - smoothed) * (level > smoothed ? ATTACK : RELEASE);

      node.style.setProperty('--voice-level', smoothed.toFixed(3));
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      node.style.removeProperty('--voice-level');

      void cleanup();
    };
  }, [track]);

  return ref;
};
