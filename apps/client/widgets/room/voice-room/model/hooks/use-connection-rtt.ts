'use client';

import { useRoomContext } from '@livekit/components-react';
import { useInterval } from '@siberiacancode/reactuse';
import { useEffect, useEffectEvent, useState } from 'react';

const POLL_INTERVAL_MS = 2_000;

export const useConnectionRtt = (): number | null => {
  const [rtt, setRtt] = useState<number | null>(null);

  const room = useRoomContext();

  const sample = useEffectEvent(async () => {
    const publisher = room.engine?.pcManager?.publisher;

    if (!publisher) {
      return;
    }

    const stats = await publisher.getStats();

    for (const report of stats.values()) {
      if (
        report.type === 'candidate-pair' &&
        report.state === 'succeeded' &&
        typeof report.currentRoundTripTime === 'number'
      ) {
        setRtt(Math.round(report.currentRoundTripTime * 1_000));
        return;
      }
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: resample immediately when LiveKit room instance changes
  useEffect(() => {
    void sample();
  }, [room]);

  useInterval(() => {
    void sample();
  }, POLL_INTERVAL_MS);

  return rtt;
};
