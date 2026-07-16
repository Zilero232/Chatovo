import { clsx } from 'clsx';

import { ROUTES } from '@/shared/constants';
import { Button, Text } from '@/shared/ui';
import { LANDING_WAVE_BARS } from '../../../config';
import { LandingDownloadButton } from '../LandingDownloadButton';

import s from '../../LandingPage.module.scss';

import type { LandingSectionProps } from '../../LandingPage.types';

export const LandingHero = ({ content, locale }: LandingSectionProps) => (
  <section className={clsx(s.container, s.hero)}>
    <div className={s.heroCopy}>
      <span className={s.eyebrow}>
        <span aria-hidden className={s.eyebrowDot} />
        {content.hero.eyebrow}
      </span>

      <h1 className={s.heroTitle}>
        {content.hero.title}{' '}
        <span className={clsx(s.heroTitleAccent, 'gradient-text')}>{content.hero.titleAccent}</span>
      </h1>

      <Text className={s.heroDescription} size="lg" tone="muted">
        {content.hero.description}
      </Text>

      <div className={s.heroActions}>
        <Button href={ROUTES.auth} size="lg">
          {content.hero.ctaPrimary}
        </Button>
        <LandingDownloadButton label={content.hero.ctaSecondary} locale={locale} />
      </div>
    </div>

    <div className={clsx(s.heroVisual, 'glass')}>
      <div aria-hidden className={s.wave}>
        {LANDING_WAVE_BARS.map((bar) => (
          <span
            key={bar.id}
            className={s.waveBar}
            style={{ height: bar.height, animationDelay: bar.delay }}
          />
        ))}
      </div>
    </div>
  </section>
);
