'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { UserAvatar, useCurrentUser } from '@/entities/auth/user';

import s from '../../LobbyHeader.module.scss';

export const LobbyGreeting = () => {
  const t = useTranslations('lobby');
  const { displayName, avatarUrl } = useCurrentUser();

  const welcome = t('welcome', { name: displayName });
  const canHighlightName = displayName.length > 0 && welcome.includes(displayName);
  const welcomeLead = canHighlightName ? welcome.split(displayName)[0] : welcome;

  return (
    <div className={s.identity}>
      <div className={s.avatarWrap}>
        <UserAvatar
          name={displayName}
          src={avatarUrl}
          className={s.avatar}
          fallbackClassName={clsx(s.avatarFallback, 'gradient-brand')}
        />
      </div>

      <div className={s.text}>
        <h2 className={s.title}>
          {canHighlightName ? (
            <>
              {welcomeLead}
              <span className={clsx(s.titleName, 'gradient-text')}>{displayName}</span>
            </>
          ) : (
            <span className={clsx(s.titleName, 'gradient-text')}>{welcomeLead}</span>
          )}
        </h2>
        <p className={s.subtitle}>{t('subtitle')}</p>
      </div>
    </div>
  );
};
