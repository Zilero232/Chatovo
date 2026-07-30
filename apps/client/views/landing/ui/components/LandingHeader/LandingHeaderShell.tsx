'use client';

import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';

import type { LandingHeaderShellProps } from './LandingHeaderShell.types';

import s from '../../LandingPage.module.scss';

export const LandingHeaderShell = ({ children }: LandingHeaderShellProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setIsScrolled(!entry.isIntersecting), {
      rootMargin: '0px'
    });

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div aria-hidden ref={sentinelRef} className={s.headerSentinel} />

      <header className={clsx(s.header, isScrolled && s.headerScrolled)}>
        <div className={clsx(s.container, s.headerInner)}>{children}</div>
      </header>
    </>
  );
};
