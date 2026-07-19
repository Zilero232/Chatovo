import { clsx } from 'clsx';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { BrandMark, Text } from '@/shared/ui';

import s from '../../LandingPage.module.scss';

import type { LandingSectionProps } from '../../LandingPage.types';

export const LandingFooter = async ({ locale }: LandingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'landing.footer' });

  return (
    <footer className={clsx(s.container, s.footer)}>
      <div className={s.footerBrand}>
        <div className={s.footerBrandRow}>
          <BrandMark size={24} />
          <Text as="span" className={s.footerBrandName} weight="semibold">
            {SITE.name}
          </Text>
        </div>

        <Text size="sm" tone="muted">
          {t('tagline')}
        </Text>
      </div>

      <nav className={s.footerLinks}>
        <Link className={s.footerLink} href={ROUTES.privacy}>
          {t('privacy')}
        </Link>
        <Link className={s.footerLink} href={ROUTES.terms}>
          {t('terms')}
        </Link>
        <Text size="sm" tone="muted">
          © {new Date().getFullYear()} {SITE.name}
        </Text>
      </nav>
    </footer>
  );
};
