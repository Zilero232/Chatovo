'use client';

import { useRoomContext } from '@livekit/components-react';
import { useInterval } from '@siberiacancode/reactuse';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

const POLL_INTERVAL_MS = 2_000;

const readRtt = async (publisher: { getStats: () => Promise<RTCStatsReport> }) => {
  const stats = await publisher.getStats();

  for (const report of stats.values()) {
    if (
      report.type === 'candidate-pair' &&
      report.state === 'succeeded' &&
      typeof report.currentRoundTripTime === 'number'
    ) {
      return Math.round(report.currentRoundTripTime * 1_000);
    }
  }

  return null;
};

export const useConnectionRtt = (): number | null => {
  const [rtt, setRtt] = useState<number | null>(null);

  const room = useRoomContext();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const sample = useEffectEvent(async () => {
    const publisher = room.engine?.pcManager?.publisher;

    if (!publisher) {
      setRtt(null);

      return;
    }

    try {
      const next = await readRtt(publisher);

      if (isMountedRef.current) {
        setRtt(next);
      }
    } catch {
      if (isMountedRef.current) {
        setRtt(null);
      }
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: resample when the room instance changes
  useEffect(() => {
    void sample();
  }, [room]);

  useInterval(() => {
    void sample();
  }, POLL_INTERVAL_MS);

  return rtt;
};
