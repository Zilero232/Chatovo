import { AuthBackground } from '@/ui-kit';

import type { MarketingShellProps } from './MarketingShell.types';

import { MarketingFooter, MarketingHeader } from './components';
import { MarketingDocumentSetup } from './controllers';

import s from './MarketingShell.module.scss';

export const MarketingShell = ({ children, locale, path }: MarketingShellProps) => (
  <div className={s.root}>
    <MarketingDocumentSetup locale={locale} />
    <AuthBackground />

    <MarketingHeader locale={locale} path={path} />

    <main>{children}</main>

    <MarketingFooter locale={locale} />
  </div>
);
