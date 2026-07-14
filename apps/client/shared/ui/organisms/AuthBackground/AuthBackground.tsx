'use client';

import { useMouse } from '@siberiacancode/reactuse';
import { useRef } from 'react';

const usePointerParallax = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const frameRef = useRef<number | null>(null);

  useMouse<T>(({ clientX, clientY }) => {
    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;

      const node = ref.current;
      if (!node) {
        return;
      }

      const x = clientX / window.innerWidth - 0.5;
      const y = clientY / window.innerHeight - 0.5;

      node.style.setProperty('--px', x.toFixed(3));
      node.style.setProperty('--py', y.toFixed(3));
    });
  });

  return ref;
};

export const AuthBackground = () => {
  const bgRef = usePointerParallax<HTMLDivElement>();

  return (
    <div ref={bgRef} className="auth-bg">
      <div className="auth-grid" />
      <div className="auth-aurora" />
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
    </div>
  );
};
