import type { ReactNode } from 'react';

const setupLandingDocument = `(function(){var r=document.documentElement;r.classList.add('landing');r.lang=location.pathname.indexOf('/en')===0?'en-US':'ru-RU'})()`;

const MarketingLayout = ({ children }: { children: ReactNode }) => (
  <>
    <script
      suppressHydrationWarning
      // biome-ignore lint/security/noDangerouslySetInnerHtml: sets scroll class and lang before first paint
      dangerouslySetInnerHTML={{ __html: setupLandingDocument }}
    />
    {children}
  </>
);

export default MarketingLayout;
