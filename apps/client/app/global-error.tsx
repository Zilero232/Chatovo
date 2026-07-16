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
          textAlign: 'center',
        }}
      >
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
            background: 'rgb(255 255 255 / 8%)',
          }}
          type="button"
          onClick={reset}
        >
          Обновить
        </button>
      </main>
    </body>
  </html>
);

export default GlobalError;
