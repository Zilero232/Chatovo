'use client';

import type { ChartTooltipProps } from './ChartTooltip.types';

import { formatChartDay } from '../../../lib';

import s from './ChartTooltip.module.scss';

export const ChartTooltip = ({ label, active, payload }: ChartTooltipProps) => {
  const point = payload?.[0];

  if (!active || !point) {
    return null;
  }

  return (
    <div className={s.root}>
      <span className={s.date}>{formatChartDay(point.payload?.date ?? '')}</span>
      <span className={s.value}>
        {label}: <b>{(point.value ?? 0).toLocaleString()}</b>
      </span>
    </div>
  );
};
