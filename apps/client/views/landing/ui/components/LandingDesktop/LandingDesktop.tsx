import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';

import { Text } from '@/shared/ui';
import { LANDING_DESKTOP_ICONS, LANDING_DESKTOP_KEYS } from '../../../config';
import { LandingDownloadButton } from '../LandingDownloadButton';
import { LandingReveal } from '../LandingReveal';

import s from '../../LandingPage.module.scss';

import type { LandingSectionProps } from '../../LandingPage.types';

export const LandingDesktop = async ({ locale }: LandingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'landing.desktop' });

  return (
    <section className={clsx(s.container, s.section)} id="desktop">
      <LandingReveal className={clsx(s.desktop, 'glass')}>
        <div className={s.desktopCopy}>
          <Text as="span" className={s.eyebrow} size="xs" weight="medium">
            <span aria-hidden className={s.eyebrowDot} />
            {t('eyebrow')}
          </Text>

          <Text as="h2" className={s.desktopHeading} weight="semibold">
            {t('heading')}
          </Text>

          <Text size="base" tone="muted">
            {t('description')}
          </Text>

          <div className={s.desktopActions}>
            <LandingDownloadButton label={t('cta')} locale={locale} />
            <Text size="sm" tone="muted">
              {t('platforms')}
            </Text>
          </div>
        </div>

        <ul className={s.desktopPerks}>
          {LANDING_DESKTOP_KEYS.map((key) => {
            const Icon = LANDING_DESKTOP_ICONS[key];

            return (
              <li key={key} className={s.desktopPerk}>
                <span aria-hidden className={s.featureIcon}>
                  <Icon />
                </span>

                <div>
                  <Text as="h3" className={s.desktopPerkTitle} weight="semibold">
                    {t(`items.${key}.title`)}
                  </Text>
                  <Text size="sm" tone="muted">
                    {t(`items.${key}.description`)}
                  </Text>
                </div>
              </li>
            );
          })}
        </ul>
      </LandingReveal>
    </section>
  );
};
