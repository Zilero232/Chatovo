import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';

import { RevealOnScroll, Text } from '@/ui-kit';
import { MarketingAuthCta } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_ACTIVE_SPEAKERS, HOME_HERO_STAT_COUNTS, HOME_HERO_STAT_KEYS } from '../../../config';
import { HomeHeroStat } from '../HomeHeroStat/HomeHeroStat';
import { HomeHeroVisual } from '../HomeHeroVisual/HomeHeroVisual';

import s from '../../HomePage.module.scss';

export const HomeHero = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return (
    <section className={clsx(s.container, s.hero)}>
      <div className={s.heroCopy}>
        <RevealOnScroll>
          <Text as='span' className={s.eyebrow} size='xs' weight='medium'>
            <span aria-hidden className={s.eyebrowDot} />
            {t('eyebrow')}
          </Text>
        </RevealOnScroll>

        <RevealOnScroll delay={0.06}>
          <Text as='h1' className={s.heroTitle} weight='bold'>
            {t('title')}{' '}
            <span className={clsx(s.heroTitleAccent, 'gradient-text')}>{t('titleAccent')}</span>
          </Text>
        </RevealOnScroll>

        <RevealOnScroll delay={0.12}>
          <Text className={s.heroDescription} size='lg' tone='muted'>
            {t('description')}
          </Text>
        </RevealOnScroll>

        <RevealOnScroll delay={0.18}>
          <div className={s.heroActions}>
            <MarketingAuthCta
              openAppLabel={t('ctaOpenApp')}
              signInLabel={t('ctaPrimary')}
              size='lg'
            />
            <Text className={s.heroNote} size='sm' tone='muted'>
              {t('ctaNote')}
            </Text>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.24}>
          <dl className={s.heroStats}>
            {HOME_HERO_STAT_KEYS.map((key) => (
              <HomeHeroStat
                key={key}
                count={HOME_HERO_STAT_COUNTS[key]}
                fallback={t(`stats.${key}.value`)}
                label={t(`stats.${key}.label`)}
                suffix={t(`stats.${key}.suffix`)}
              />
            ))}
          </dl>
        </RevealOnScroll>
      </div>

      <HomeHeroVisual liveLabel={t('liveLabel', { count: HOME_ACTIVE_SPEAKERS })} />
    </section>
  );
};
