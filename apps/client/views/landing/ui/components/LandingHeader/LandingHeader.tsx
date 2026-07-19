import { clsx } from 'clsx';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { BrandMark, Button, Text } from '@/shared/ui';
import { LANDING_LOCALE_SWITCH, LANDING_NAV_KEYS } from '../../../config';
import { LandingHeaderShell } from './LandingHeaderShell';

import s from '../../LandingPage.module.scss';

import type { LandingSectionProps } from '../../LandingPage.types';

export const LandingHeader = async ({ locale }: LandingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'landing.nav' });
  const localeSwitch = LANDING_LOCALE_SWITCH[locale];

  return (
    <LandingHeaderShell>
      <Link className={s.brand} href={locale === 'ru' ? ROUTES.landing : ROUTES.landingEn}>
        <BrandMark glow size={30} />
        <Text as="span" className={clsx(s.brandName, 'gradient-text')} tone="inherit">
          {SITE.name}
        </Text>
      </Link>

      <nav aria-label={t('ariaLabel')} className={s.headerNav}>
        {LANDING_NAV_KEYS.map((key) => (
          <a key={key} className={s.headerNavLink} href={`#${key}`}>
            {t(`links.${key}`)}
          </a>
        ))}
      </nav>

      <div className={s.headerActions}>
        <Link className={s.localeSwitch} href={localeSwitch.href} hrefLang={localeSwitch.hrefLang}>
          {t('localeSwitch')}
        </Link>

        <Button className={s.headerCta} href={ROUTES.auth} size="sm">
          {t('signIn')}
        </Button>
      </div>
    </LandingHeaderShell>
  );
};
