import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { SITE } from '@/shared/config';
import { EXTERNAL_LINKS, ROUTES } from '@/shared/constants';
import { BrandMark, GithubIcon, Text } from '@/ui-kit';

import type { LandingSectionProps } from '../../LandingPage.types';

import s from '../../LandingPage.module.scss';

const buildYear = new Date().getFullYear();

export const LandingFooter = async ({ locale }: LandingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'landing.footer' });

  return (
    <footer className={clsx(s.container, s.footer)}>
      <div className={s.footerBrand}>
        <div className={s.footerBrandRow}>
          <BrandMark size={24} />
          <Text as='span' className={s.footerBrandName} weight='semibold'>
            {SITE.name}
          </Text>
        </div>

        <Text size='sm' tone='muted'>
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
        <a
          className={s.footerLink}
          href={EXTERNAL_LINKS.repository}
          rel='noopener noreferrer'
          target='_blank'
        >
          <GithubIcon className={s.footerLinkIcon} />
          {t('github')}
        </a>
        <Text size='sm' tone='muted'>
          © {buildYear} {SITE.name}
        </Text>
      </nav>
    </footer>
  );
};
