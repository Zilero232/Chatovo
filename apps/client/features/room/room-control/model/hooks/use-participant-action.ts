'use client';

import { useEffect, useRef, useState } from 'react';
import { isNullish } from 'remeda';

import { isCancelled } from '../../lib/media-errors';

import type { LocalParticipant } from 'livekit-client';

const PENDING_VISIBLE_AFTER_MS = 250;

export type ParticipantAction = {
  run: () => Promise<void>;
  isPending: boolean;
};

export const useParticipantAction = (
  participant: LocalParticipant | undefined,
  action: (participant: LocalParticipant) => Promise<unknown>,
): ParticipantAction => {
  const [isPending, setIsPending] = useState(false);
  const isRunningRef = useRef(false);
  const isMountedRef = useRef(true);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    };
  }, []);

  const run = async () => {
    if (isNullish(participant) || isRunningRef.current) {
      return;
    }

    isRunningRef.current = true;

    revealTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && isRunningRef.current) {
        setIsPending(true);
      }
    }, PENDING_VISIBLE_AFTER_MS);

    try {
      await action(participant);
    } catch (err) {
      if (!isCancelled(err)) {
        console.error('room control action failed', err);
      }
    } finally {
      isRunningRef.current = false;

      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
        revealTimeoutRef.current = null;
      }

      if (isMountedRef.current) {
        setIsPending(false);
      }
    }
  };

  return { run, isPending };
};
