'use client';

import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';

import s from '../../LandingPage.module.scss';

import type { LandingHeaderShellProps } from './LandingHeaderShell.types';

export const LandingHeaderShell = ({ children }: LandingHeaderShellProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setIsScrolled(!entry.isIntersecting), {
      rootMargin: '0px',
    });

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className={s.headerSentinel} />

      <header className={clsx(s.header, isScrolled && s.headerScrolled)}>
        <div className={clsx(s.container, s.headerInner)}>{children}</div>
      </header>
    </>
  );
};
