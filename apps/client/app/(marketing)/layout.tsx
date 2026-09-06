import type { ReactNode } from 'react';

import { MarketingProviders } from './providers';

const setupMarketingDocument =
  "(function(){var r=document.documentElement;r.classList.add('marketing');r.lang=location.pathname.indexOf('/en')===0?'en-US':'ru-RU'})()";

const MarketingLayout = ({ children }: { children: ReactNode }) => (
  <>
    <script
      suppressHydrationWarning
      // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml -- sets scroll class and lang before first paint
      dangerouslySetInnerHTML={{ __html: setupMarketingDocument }}
    />
    <MarketingProviders>{children}</MarketingProviders>
  </>
);

export default MarketingLayout;
