'use client';

import { useInterval } from '@siberiacancode/reactuse';
import { createAudioAnalyser, LocalAudioTrack } from 'livekit-client';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { audioConstraints } from '@/entities/app/settings';

import type { AudioSettings } from '@/entities/app/settings';

const LEVEL_INTERVAL_MS = 60;

type MicAnalyserArgs = {
  deviceId: string;
  audio: AudioSettings;
  active: boolean;
  onReady?: (stream: MediaStream) => void;
  onError?: () => void;
};

export const useMicAnalyser = ({ deviceId, audio, active, onReady, onError }: MicAnalyserArgs) => {
  const [level, setLevel] = useState(0);

  const calcVolumeRef = useRef<(() => number) | null>(null);

  const { noiseSuppression, echoCancellation, autoGainControl, voiceIsolation } = audio;

  const handleReady = useEffectEvent((stream: MediaStream) => onReady?.(stream));
  const handleError = useEffectEvent(() => onError?.());

  useEffect(() => {
    if (!active) {
      return;
    }

    let track: LocalAudioTrack | undefined;
    let cleanup: (() => Promise<void>) | undefined;
    let cancelled = false;

    const flags = { noiseSuppression, echoCancellation, autoGainControl, voiceIsolation };

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints(flags, deviceId),
        });

        if (cancelled) {
          for (const t of stream.getTracks()) {
            t.stop();
          }

          return;
        }

        track = new LocalAudioTrack(stream.getAudioTracks()[0]);

        handleReady(stream);

        const analyser = createAudioAnalyser(track);
        calcVolumeRef.current = analyser.calculateVolume;
        cleanup = analyser.cleanup;
      } catch {
        if (!cancelled) {
          handleError();
        }
      }
    };

    start();

    return () => {
      cancelled = true;

      calcVolumeRef.current = null;
      cleanup?.();
      track?.stop();

      setLevel(0);
    };
  }, [deviceId, noiseSuppression, echoCancellation, autoGainControl, voiceIsolation, active]);

  useInterval(() => {
    if (calcVolumeRef.current) {
      setLevel(calcVolumeRef.current());
    }
  }, LEVEL_INTERVAL_MS);

  return level;
};
