'use client';

import { useEffect, useEffectEvent } from 'react';

type AnyFn = (...args: any[]) => any;

type Emitter = {
  off: AnyFn;
  on: AnyFn;
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
