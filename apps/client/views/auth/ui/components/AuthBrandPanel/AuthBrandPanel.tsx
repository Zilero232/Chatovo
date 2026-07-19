'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { BrandMark, Text } from '@/shared/ui';
import { AUTH_FEATURES } from '../../../config';
import { AuthRoomPreview } from '../AuthRoomPreview';
import { AuthStats } from '../AuthStats';

import s from './AuthBrandPanel.module.scss';

export const AuthBrandPanel = () => {
  const t = useTranslations('auth');

  return (
    <aside className={s.root}>
      <div className={clsx(s.orb, 'auth-orb')} />

      <div className={s.top}>
        <BrandMark glow className={s.mark} size={38} />
        <span className={clsx(s.wordmark, 'gradient-text')}>{t('appName')}</span>
      </div>

      <div className={s.center}>
        <h2 className={s.tagline}>{t('tagline')}</h2>

        <AuthRoomPreview />

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

      <AuthStats />
    </aside>
  );
};
