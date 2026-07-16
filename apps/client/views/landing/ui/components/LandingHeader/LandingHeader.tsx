import { clsx } from 'clsx';
import Link from 'next/link';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { BrandMark, Button } from '@/shared/ui';

import s from '../../LandingPage.module.scss';

import type { LandingSectionProps } from '../../LandingPage.types';

export const LandingHeader = ({ content, locale }: LandingSectionProps) => (
  <header className={clsx(s.container, s.header)}>
    <Link className={s.brand} href={locale === 'ru' ? ROUTES.landing : ROUTES.landingEn}>
      <BrandMark glow size={32} />
      <span className={clsx(s.brandName, 'gradient-text')}>{SITE.name}</span>
    </Link>

    <div className={s.headerActions}>
      <Button href={ROUTES.auth} size="sm" variant="ghost">
        {content.nav.signIn}
      </Button>
    </div>
  </header>
);
