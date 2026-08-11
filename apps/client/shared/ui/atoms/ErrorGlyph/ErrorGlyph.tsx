import { clsx } from 'clsx';
import { useId } from 'react';
import { match } from 'ts-pattern';

import type { ErrorGlyphProps } from './ErrorGlyph.types';

import s from './ErrorGlyph.module.scss';

const WAVE_LEFT_BARS = [16, 30, 22, 44];

const WAVE_RIGHT_BARS = [40, 20, 32, 14];

const SIGNAL_ARCS = [
  'M62 74 A14 14 0 0 1 86 74',
  'M50 62 A30 30 0 0 1 98 62',
  'M38 50 A46 46 0 0 1 110 50'
];

export const ErrorGlyph = ({ variant = 'broken-wave', className, ...props }: ErrorGlyphProps) => {
  const gradientId = useId();

  return (
    <svg
      aria-hidden
      className={clsx(s.root, className)}
      fill='none'
      focusable='false'
      viewBox='0 0 148 148'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0%' stopColor='var(--brand-cyan)' />
          <stop offset='100%' stopColor='var(--brand-violet)' />
        </linearGradient>
      </defs>

      <g stroke={`url(#${gradientId})`} strokeLinecap='round'>
        {match(variant)
          .with('broken-wave', () => (
            <>
              <g strokeWidth='5'>
                {WAVE_LEFT_BARS.map((height, index) => {
                  const x = 20 + index * 13;

                  return (
                    <line
                      key={x}
                      opacity={0.35 + index * 0.15}
                      x1={x}
                      x2={x}
                      y1={74 - height / 2}
                      y2={74 + height / 2}
                    />
                  );
                })}
              </g>

              <g strokeWidth='5'>
                {WAVE_RIGHT_BARS.map((height, index) => {
                  const x = 89 + index * 13;

                  return (
                    <line
                      key={x}
                      opacity={0.8 - index * 0.15}
                      x1={x}
                      x2={x}
                      y1={74 - height / 2}
                      y2={74 + height / 2}
                    />
                  );
                })}
              </g>

              <line
                className={s.break}
                opacity='0.55'
                strokeDasharray='4 7'
                strokeWidth='2'
                x1='79'
                x2='79'
                y1='36'
                y2='112'
              />
            </>
          ))
          .with('lost-signal', () => (
            <>
              {SIGNAL_ARCS.map((d, index) => (
                <path
                  key={d}
                  d={d}
                  opacity={0.7 - index * 0.2}
                  strokeDasharray={index === 0 ? undefined : '5 8'}
                  strokeWidth='4'
                />
              ))}

              <circle cx='74' cy='86' fill={`url(#${gradientId})`} r='6' stroke='none' />

              <line opacity='0.75' strokeWidth='4' x1='36' x2='112' y1='112' y2='36' />
            </>
          ))
          .with('severed-ring', () => (
            <>
              <path d='M74 26 A48 48 0 1 1 40 108' opacity='0.75' strokeWidth='4' />
              <path
                d='M32 96 A48 48 0 0 1 46 40'
                opacity='0.3'
                strokeDasharray='4 9'
                strokeWidth='4'
              />
              <circle
                cx='74'
                cy='74'
                fill={`url(#${gradientId})`}
                opacity='0.5'
                r='7'
                stroke='none'
              />
            </>
          ))
          .exhaustive()}
      </g>
    </svg>
  );
};
