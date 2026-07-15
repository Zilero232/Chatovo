import { ImageResponse } from 'next/og';

import { SITE } from '@/shared/config';

export const dynamic = 'force-static';
export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const Image = () => {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '96px',
        background: '#0a0a0a',
        backgroundImage:
          'radial-gradient(900px 500px at 18% 20%, rgba(157,123,255,0.28), transparent 60%), radial-gradient(900px 500px at 90% 95%, rgba(95,230,255,0.22), transparent 60%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #9d7bff, #5fe6ff)',
          }}
        />
        <div style={{ fontSize: '44px', fontWeight: 700, color: '#ffffff' }}>{SITE.name}</div>
      </div>

      <div
        style={{
          marginTop: '40px',
          fontSize: '76px',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: '#ffffff',
          maxWidth: '900px',
        }}
      >
        Real-time voice &amp; video rooms
      </div>

      <div
        style={{
          marginTop: '28px',
          fontSize: '32px',
          lineHeight: 1.35,
          color: 'rgba(255,255,255,0.66)',
          maxWidth: '880px',
        }}
      >
        Spin up a private room in one click, share the link, and start talking — in the browser or
        on the desktop.
      </div>
    </div>,
    size,
  );
};

export default Image;
