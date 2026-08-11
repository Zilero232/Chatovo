'use client';

import { clsx } from 'clsx';
import { useId } from 'react';

import type { RoomCapacityArcProps } from './RoomCapacityArc.types';

import { ARC_CIRCUMFERENCE, ARC_RADIUS, ARC_SIZE, readArcFill } from './lib';

import s from './RoomCapacityArc.module.scss';

export const RoomCapacityArc = ({ count, capacity, className }: RoomCapacityArcProps) => {
  const gradientId = useId();

  const fill = readArcFill({ count, capacity });
  const center = ARC_SIZE / 2;

  return (
    <span className={clsx(s.root, className)}>
      <svg
        aria-hidden
        className={s.svg}
        fill='none'
        focusable='false'
        viewBox={`0 0 ${ARC_SIZE} ${ARC_SIZE}`}
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <linearGradient id={gradientId} x1='0' x2='1' y1='0' y2='1'>
            <stop offset='0%' stopColor='var(--brand-cyan)' />
            <stop offset='100%' stopColor='var(--brand-violet)' />
          </linearGradient>
        </defs>

        <circle className={s.track} cx={center} cy={center} r={ARC_RADIUS} />
        <circle
          className={s.progress}
          cx={center}
          cy={center}
          r={ARC_RADIUS}
          stroke={`url(#${gradientId})`}
          strokeDasharray={`${(ARC_CIRCUMFERENCE * fill).toFixed(2)} ${ARC_CIRCUMFERENCE.toFixed(2)}`}
        />
      </svg>

      <span className={s.count}>{count}</span>
    </span>
  );
};
