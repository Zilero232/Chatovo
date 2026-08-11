'use client';

import { useEventListener } from '@siberiacancode/reactuse';
import { useRef } from 'react';

import { isTauriMobile } from '@/shared/lib';

export const usePointerGlow = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const frameRef = useRef<number | null>(null);

  const enabled = !isTauriMobile();

  useEventListener(
    ref,
    'pointermove',
    (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || frameRef.current !== null) {
        return;
      }

      const { clientX, clientY } = event;

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;

        const node = ref.current;
        if (!node) {
          return;
        }

        const rect = node.getBoundingClientRect();

        node.style.setProperty(
          '--px',
          `${(((clientX - rect.left) / rect.width) * 100).toFixed(2)}%`
        );
        node.style.setProperty(
          '--py',
          `${(((clientY - rect.top) / rect.height) * 100).toFixed(2)}%`
        );
      });
    },
    { enabled }
  );

  useEventListener(
    ref,
    'pointerenter',
    (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        return;
      }

      ref.current?.style.setProperty('--glow-opacity', '1');
    },
    { enabled }
  );

  useEventListener(
    ref,
    'pointerleave',
    () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      ref.current?.style.setProperty('--glow-opacity', '0');
    },
    { enabled }
  );

  return ref;
};
