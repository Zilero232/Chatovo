'use client';

import NumberFlow from '@number-flow/react';
import { useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

import { Text } from '@/shared/ui';

import s from '../../LandingPage.module.scss';

import type { LandingHeroStatProps } from './LandingHeroStat.types';

export const LandingHeroStat = ({ count, fallback, suffix, label }: LandingHeroStatProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const shouldReduceMotion = useReducedMotion();

  const isAnimated = count !== null && !shouldReduceMotion;

  return (
    <div ref={ref} className={s.heroStat}>
      <Text as="dt" className={s.heroStatValue} weight="bold">
        {isAnimated ? <NumberFlow suffix={suffix} value={isInView ? count : 0} /> : fallback}
      </Text>

      <Text as="dd" className={s.heroStatLabel} size="sm" tone="muted">
        {label}
      </Text>
    </div>
  );
};
