import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';

import { Text } from '@/ui-kit';

import type { LandingSectionProps } from '../../LandingPage.types';

import {
  LANDING_ACTIVE_SPEAKERS,
  LANDING_HERO_STAT_COUNTS,
  LANDING_HERO_STAT_KEYS
} from '../../../config';
import { LandingAuthCta } from '../LandingAuthCta/LandingAuthCta';
import { LandingHeroStat } from '../LandingHeroStat/LandingHeroStat';
import { LandingHeroVisual } from '../LandingHeroVisual/LandingHeroVisual';
import { LandingReveal } from '../LandingReveal/LandingReveal';

import s from '../../LandingPage.module.scss';

export const LandingHero = async ({ locale }: LandingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'landing.hero' });

  return (
    <section className={clsx(s.container, s.hero)}>
      <div className={s.heroCopy}>
        <LandingReveal>
          <Text as='span' className={s.eyebrow} size='xs' weight='medium'>
            <span aria-hidden className={s.eyebrowDot} />
            {t('eyebrow')}
          </Text>
        </LandingReveal>

        <LandingReveal delay={0.06}>
          <Text as='h1' className={s.heroTitle} weight='bold'>
            {t('title')}{' '}
            <span className={clsx(s.heroTitleAccent, 'gradient-text')}>{t('titleAccent')}</span>
          </Text>
        </LandingReveal>

        <LandingReveal delay={0.12}>
          <Text className={s.heroDescription} size='lg' tone='muted'>
            {t('description')}
          </Text>
        </LandingReveal>

        <LandingReveal delay={0.18}>
          <div className={s.heroActions}>
            <LandingAuthCta
              openAppLabel={t('ctaOpenApp')}
              signInLabel={t('ctaPrimary')}
              size='lg'
            />
            <Text className={s.heroNote} size='sm' tone='muted'>
              {t('ctaNote')}
            </Text>
          </div>
        </LandingReveal>

        <LandingReveal delay={0.24}>
          <dl className={s.heroStats}>
            {LANDING_HERO_STAT_KEYS.map((key) => (
              <LandingHeroStat
                key={key}
                count={LANDING_HERO_STAT_COUNTS[key]}
                fallback={t(`stats.${key}.value`)}
                label={t(`stats.${key}.label`)}
                suffix={t(`stats.${key}.suffix`)}
              />
            ))}
          </dl>
        </LandingReveal>
      </div>

      <LandingHeroVisual liveLabel={t('liveLabel', { count: LANDING_ACTIVE_SPEAKERS })} />
    </section>
  );
};
