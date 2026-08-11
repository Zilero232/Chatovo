'use client';

import NumberFlow from '@number-flow/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

import { Text } from '@/shared/ui';

import type { LandingHeroStatProps } from './LandingHeroStat.types';

import s from '../../LandingPage.module.scss';

export const LandingHeroStat = ({ count, fallback, suffix, label }: LandingHeroStatProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div ref={ref} className={s.heroStat}>
      <Text as='dt' className={s.heroStatValue} weight='bold'>
        {count === null ? fallback : <NumberFlow suffix={suffix} value={isInView ? count : 0} />}
      </Text>

      <Text as='dd' className={s.heroStatLabel} size='sm' tone='muted'>
        {label}
      </Text>
    </div>
  );
};
