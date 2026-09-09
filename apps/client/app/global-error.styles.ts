import type { CSSProperties } from 'react';

export const GLOBAL_ERROR_STYLES = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '1.5rem',
    textAlign: 'center'
  },
  title: { margin: 0, fontSize: '1.5rem', fontWeight: 600 },
  description: { margin: 0, maxWidth: '28rem', opacity: 0.7 },
  button: {
    padding: '0.625rem 1.25rem',
    border: '1px solid rgb(255 255 255 / 15%)',
    borderRadius: '0.5rem',
    color: 'inherit',
    background: 'rgb(255 255 255 / 8%)'
  }
} satisfies Record<string, CSSProperties>;
