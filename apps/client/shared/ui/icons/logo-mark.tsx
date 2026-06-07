import { useId } from 'react';
import type { SVGProps } from 'react';

interface LogoMarkProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  size?: number;
  simplified?: boolean;
  withPlaque?: boolean;
}

const DETAIL = 'var(--brand-violet)';

export const LogoMark = ({
  size = 24,
  simplified = false,
  withPlaque = false,
  ...props
}: LogoMarkProps) => {
  const id = useId();
  const plaqueId = `${id}-plaque`;
  const body = withPlaque ? '#ffffff' : 'currentColor';
  const detail = withPlaque ? '#6a4dff' : DETAIL;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="Chatovo"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {withPlaque && (
        <>
          <defs>
            <linearGradient id={plaqueId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7b5cff" />
              <stop offset="0.5" stopColor="#6a4dff" />
              <stop offset="1" stopColor="#4ea8e6" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="24" fill={`url(#${plaqueId})`} />
        </>
      )}

      <g transform={withPlaque ? 'translate(50 50) scale(0.78) translate(-50 -50)' : undefined}>
        <g fill={body}>
          <path d="M21 41 Q18 16 35 23 Q43 27 45 40 Z" />
          <path d="M79 41 Q82 16 65 23 Q57 27 55 40 Z" />
          <path d="M50 30 Q79 30 79 56 Q79 76 64 82 Q57 80 50 82 Q43 80 36 82 Q21 76 21 56 Q21 30 50 30 Z" />
        </g>

        <path d="M27 37 Q26 24 34 28 Q39 31 40 39 Z" fill={detail} opacity={0.85} />
        <path d="M73 37 Q74 24 66 28 Q61 31 60 39 Z" fill={detail} opacity={0.85} />

        {simplified ? (
          <>
            <circle cx="40" cy="54" r="7" fill={detail} />
            <circle cx="60" cy="54" r="7" fill={detail} />
            <path d="M50 61 L45 67 H55 Z" fill={detail} />
          </>
        ) : (
          <>
            <circle cx="40" cy="54" r="6.6" fill={detail} />
            <circle cx="42.3" cy="51.4" r="2.2" fill={body} />
            <path
              d="M54 54 Q60 49 66 54"
              stroke={detail}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
            <path d="M50 61 L45.5 67 H54.5 Z" fill={detail} />
            <path
              d="M42 70 Q50 78 58 70"
              stroke={detail}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
      </g>
    </svg>
  );
};
