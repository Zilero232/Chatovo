'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';
import { useRef } from 'react';

export type ParticipantSessionStats = {
  joinedAt: number;
  speakingMs: number;
  speakingSince: number | null;
};

export type ParticipantStatsSnapshot = {
  presenceMs: number;
  speakingMs: number;
  speakingShare: number;
};

const useSessionStatsState = () => {
  const statsRef = useRef(new Map<string, ParticipantSessionStats>());

  const track = ({ identity, isSpeaking }: { identity: string; isSpeaking: boolean }) => {
    const now = Date.now();
    const current = statsRef.current.get(identity) ?? {
      joinedAt: now,
      speakingMs: 0,
      speakingSince: null
    };

    if (isSpeaking && current.speakingSince === null) {
      statsRef.current.set(identity, { ...current, speakingSince: now });

      return;
    }

    if (!isSpeaking && current.speakingSince !== null) {
      statsRef.current.set(identity, {
        ...current,
        speakingMs: current.speakingMs + (now - current.speakingSince),
        speakingSince: null
      });

      return;
    }

    if (!statsRef.current.has(identity)) {
      statsRef.current.set(identity, current);
    }
  };

  const read = (identity: string): ParticipantStatsSnapshot | null => {
    const current = statsRef.current.get(identity);

    if (!current) {
      return null;
    }

    const now = Date.now();
    const speakingMs =
      current.speakingMs + (current.speakingSince === null ? 0 : now - current.speakingSince);
    const presenceMs = Math.max(now - current.joinedAt, 1);

    return {
      presenceMs,
      speakingMs,
      speakingShare: Math.min(speakingMs / presenceMs, 1)
    };
  };

  const readAll = (): Map<string, ParticipantStatsSnapshot> => {
    const snapshot = new Map<string, ParticipantStatsSnapshot>();

    for (const identity of statsRef.current.keys()) {
      const current = read(identity);

      if (current) {
        snapshot.set(identity, current);
      }
    }

    return snapshot;
  };

  return { track, read, readAll };
};

const { Provider, use: useSessionStatsContext } = createContextHook(useSessionStatsState);

export const SessionStatsProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useSessionStats = () => {
  const value = useSessionStatsContext();

  if (!value) {
    throw new Error('useSessionStats must be used within SessionStatsProvider');
  }

  return value;
};
