'use client';

import type { Transition } from 'motion/react';

import { useSyncExternalStore } from 'react';

import { isTauriMobile } from '@/shared/lib';

const LITE_TWEEN = { type: 'tween', duration: 0.18, ease: 'easeOut' } as const;

const subscribe = () => () => {};

const getSnapshot = () => isTauriMobile();

const getServerSnapshot = () => false;

export const toLiteTransition = (transition: Transition): Transition =>
  'type' in transition && transition.type === 'spring'
    ? { ...LITE_TWEEN, delay: transition.delay }
    : transition;

export const useLiteMotion = () => {
  const isLite = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const resolveTransition = (transition: Transition): Transition =>
    isLite ? toLiteTransition(transition) : transition;

  return { isLite, layout: !isLite, resolveTransition };
};
