'use client';

import { useEffect, useEffectEvent } from 'react';

type EventListener = (...args: never[]) => unknown;

type Emitter = {
  off: (event: any, listener: any) => unknown;

  on: (event: any, listener: any) => unknown;
};

export const useEmitterEvent = <L extends EventListener>(
  emitter: Emitter,
  event: string,
  handler: L
) => {
  const onEvent = useEffectEvent(handler);

  useEffect(() => {
    const listener = (...args: Parameters<L>) => onEvent(...args);

    emitter.on(event, listener);

    return () => {
      emitter.off(event, listener);
    };
  }, [emitter, event]);
};
