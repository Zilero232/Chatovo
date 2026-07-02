'use client';

import { useEffect, useEffectEvent } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: emitters expose variant per-event signatures
type AnyFn = (...args: any[]) => any;

type Emitter = {
  on: AnyFn;
  off: AnyFn;
};

export const useEmitterEvent = <L extends AnyFn>(emitter: Emitter, event: string, handler: L) => {
  const onEvent = useEffectEvent(handler);

  useEffect(() => {
    const listener = (...args: Parameters<L>) => onEvent(...args);

    emitter.on(event, listener);

    return () => {
      emitter.off(event, listener);
    };
  }, [emitter, event]);
};
