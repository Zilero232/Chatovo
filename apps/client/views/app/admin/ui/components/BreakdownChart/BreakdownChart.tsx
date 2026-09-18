'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Text } from '@/ui-kit';

import type { BreakdownChartProps } from './BreakdownChart.types';

import { ChartTooltip } from '../ChartTooltip/ChartTooltip';

import s from './BreakdownChart.module.scss';

const AXIS_STYLE = { fill: 'currentColor', fontSize: 11 };

export const BreakdownChart = ({ title, hint, slices }: BreakdownChartProps) => (
  <section className={s.root}>
    <header className={s.head}>
      <Text size='sm' weight='medium'>
        {title}
      </Text>
      <Text size='xs' tone='muted'>
        {hint}
      </Text>
    </header>

    <div className={s.chart}>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart data={slices} layout='vertical' margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid horizontal={false} stroke='var(--border)' strokeDasharray='3 3' />
          <XAxis
            allowDecimals={false}
            axisLine={false}
            tick={AXIS_STYLE}
            tickLine={false}
            type='number'
          />
          <YAxis
            axisLine={false}
            dataKey='label'
            tick={AXIS_STYLE}
            tickLine={false}
            type='category'
            width={116}
          />
          <Tooltip
            content={<ChartTooltip label={title} />}
            cursor={{ fill: 'oklch(100% 0 0deg / 4%)' }}
          />
          <Bar dataKey='value' fill='var(--brand-violet)' radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>
);
