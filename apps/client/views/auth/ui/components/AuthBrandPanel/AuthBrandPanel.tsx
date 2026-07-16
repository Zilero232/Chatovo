'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { LogoMark, Text } from '@/shared/ui';
import { AUTH_EQ_BARS, AUTH_FEATURES } from '../../../config';

import s from './AuthBrandPanel.module.scss';

export const AuthBrandPanel = () => {
  const t = useTranslations('auth');

  return (
    <aside className={s.root}>
      <div className={clsx(s.orb, 'auth-orb')} />

      <div className={s.top}>
        <span className={clsx(s.mark, 'gradient-brand', 'shadow-glow-cyan')}>
          <LogoMark className={s.markIcon} size={26} />
        </span>
        <span className={clsx(s.wordmark, 'gradient-text')}>{t('appName')}</span>
      </div>

      <div className={s.center}>
        <h2 className={s.tagline}>{t('tagline')}</h2>

        <div className={s.features}>
          {AUTH_FEATURES.map(({ key, Icon }, index) => (
            <div
              key={key}
              className={s.feature}
              style={{ animationDelay: `${150 + index * 120}ms` }}
            >
              <span className={s.featureIcon}>
                <Icon />
              </span>
              <div className={s.featureBody}>
                <Text size="sm" weight="semibold">
                  {t(`features.${key}.title`)}
                </Text>
                <Text className={s.featureDesc} size="xs" tone="muted">
                  {t(`features.${key}.desc`)}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={s.equalizer} aria-hidden>
        {AUTH_EQ_BARS.map((bar) => (
          <span
            key={bar.id}
            className={s.eqBar}
            style={{ height: bar.height, animationDelay: bar.delay }}
          />
        ))}
      </div>
    </aside>
  );
};
