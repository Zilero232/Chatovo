'use client';

import { useRef, useState } from 'react';
import { useMicAnalyser } from './use-mic-analyser';
import type { AudioSettings } from '@/entities/app/settings';

type UseMicTest = {
  level: number;
  isLoopback: boolean;
  toggleLoopback: () => void;
  error: boolean;
};

type MicTestArgs = {
  deviceId: string;
  audio: AudioSettings;
};

export const useMicTest = ({ deviceId, audio }: MicTestArgs): UseMicTest => {
  const [isLoopback, setIsLoopback] = useState(false);
  const [error, setError] = useState(false);

  const sinkRef = useRef<HTMLAudioElement | null>(null);
  if (sinkRef.current === null && typeof Audio !== 'undefined') {
    sinkRef.current = new Audio();
  }

  const level = useMicAnalyser({
    deviceId,
    audio,
    active: isLoopback,
    onReady: (stream) => {
      setError(false);

      const sink = sinkRef.current;
      if (sink) {
        sink.srcObject = stream;
        sink.play().catch(() => {});
      }
    },
    onError: () => setError(true),
  });

  const toggleLoopback = () => {
    setIsLoopback((on) => {
      const next = !on;

      if (!next) {
        const sink = sinkRef.current;
        if (sink) {
          sink.srcObject = null;
        }
      }

      return next;
    });
  };

  return { level, isLoopback, toggleLoopback, error };
};
