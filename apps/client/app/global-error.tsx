'use client';

import { SITE } from '@/shared/config';

import 'modern-normalize/modern-normalize.css';
import './globals.scss';

type GlobalErrorProps = {
  reset: () => void;
};

const GlobalError = ({ reset }: GlobalErrorProps) => (
  <html lang={SITE.locale.split('_')[0]}>
    <body>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '1.5rem',
          textAlign: 'center'
        }}
      >
        <svg
          aria-hidden
          fill='none'
          focusable='false'
          height='96'
          viewBox='0 0 148 148'
          width='96'
          xmlns='http://www.w3.org/2000/svg'
        >
          <linearGradient id='global-error-gradient' x1='0' x2='1' y1='0' y2='1'>
            <stop offset='0%' stopColor='oklch(82% 0.16 200deg)' />
            <stop offset='100%' stopColor='oklch(70% 0.2 270deg)' />
          </linearGradient>

          <g stroke='url(#global-error-gradient)' strokeLinecap='round' strokeWidth='5'>
            {[16, 30, 22, 44].map((height, index) => {
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

            {[40, 20, 32, 14].map((height, index) => {
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

            <line
              opacity='0.55'
              stroke='oklch(64% 0.21 25deg)'
              strokeDasharray='4 7'
              strokeWidth='2'
              x1='79'
              x2='79'
              y1='36'
              y2='112'
            />
          </g>
        </svg>

        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Что-то пошло не так</h1>

        <p style={{ margin: 0, maxWidth: '28rem', opacity: 0.7 }}>
          Приложение не смогло загрузиться. Попробуйте обновить страницу.
        </p>

        <button
          style={{
            padding: '0.625rem 1.25rem',
            border: '1px solid rgb(255 255 255 / 15%)',
            borderRadius: '0.5rem',
            color: 'inherit',
            background: 'rgb(255 255 255 / 8%)'
          }}
          type='button'
          onClick={reset}
        >
          Обновить
        </button>
      </main>
    </body>
  </html>
);

export default GlobalError;
