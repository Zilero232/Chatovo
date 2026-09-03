'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { Text } from '@/ui-kit';

import type { TrendChartProps } from './TrendChart.types';

import { formatChartDay, sumTrendPoints } from '../../../lib';
import { ChartTooltip } from '../ChartTooltip/ChartTooltip';

import s from './TrendChart.module.scss';

const AXIS_STYLE = { fill: 'currentColor', fontSize: 11 };

export const TrendChart = ({ title, hint, points, color = 'violet' }: TrendChartProps) => {
  const gradientId = `trend-${color}`;
  const stroke = color === 'violet' ? 'var(--brand-violet)' : 'var(--brand-cyan)';

  return (
    <section className={s.root}>
      <header className={s.head}>
        <div className={s.headText}>
          <Text size='sm' weight='medium'>
            {title}
          </Text>
          <Text size='xs' tone='muted'>
            {hint}
          </Text>
        </div>

        <span className={s.total}>{sumTrendPoints(points).toLocaleString()}</span>
      </header>

      <div className={s.chart}>
        <ResponsiveContainer height='100%' width='100%'>
          <AreaChart data={points} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
            <defs>
              <linearGradient id={gradientId} x1='0' x2='0' y1='0' y2='1'>
                <stop offset='0%' stopColor={stroke} stopOpacity={0.35} />
                <stop offset='100%' stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke='var(--border)' strokeDasharray='3 3' vertical={false} />
            <XAxis
              axisLine={false}
              dataKey='date'
              minTickGap={24}
              tick={AXIS_STYLE}
              tickFormatter={formatChartDay}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tick={AXIS_STYLE}
              tickLine={false}
              width={44}
            />
            <Tooltip
              content={<ChartTooltip label={title} />}
              cursor={{ stroke: 'var(--border)' }}
            />
            <Area
              dataKey='count'
              fill={`url(#${gradientId})`}
              stroke={stroke}
              strokeWidth={2}
              type='monotone'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
