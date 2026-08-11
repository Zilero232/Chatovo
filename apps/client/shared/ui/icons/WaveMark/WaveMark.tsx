import type { SVGProps } from 'react';

import { clsx } from 'clsx';
import { useId } from 'react';

import s from './WaveMark.module.scss';

type WaveMarkProps = Omit<SVGProps<SVGSVGElement>, 'height' | 'width'> & {
  animated?: boolean;
  size?: number;
};

const BARS = [
  { x: 6, height: 12 },
  { x: 15, height: 26 },
  { x: 24, height: 40 },
  { x: 33, height: 26 },
  { x: 42, height: 12 }
];

export const WaveMark = ({ animated = false, size = 48, className, ...props }: WaveMarkProps) => {
  const id = useId();
  const gradientId = `${id}-gradient`;

  return (
    <svg
      aria-hidden
      className={clsx(s.root, className)}
      fill='none'
      focusable='false'
      height={size}
      viewBox='0 0 48 48'
      width={size}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0%' stopColor='var(--brand-cyan)' />
          <stop offset='100%' stopColor='var(--brand-violet)' />
        </linearGradient>
      </defs>

      <g
        className={clsx({ [s.animated]: animated })}
        stroke={`url(#${gradientId})`}
        strokeLinecap='round'
        strokeWidth='4'
      >
        {BARS.map(({ x, height }, index) => (
          <line
            key={x}
            className={s[`bar${index}`]}
            x1={x}
            x2={x}
            y1={24 - height / 2}
            y2={24 + height / 2}
          />
        ))}
      </g>
    </svg>
  );
};
