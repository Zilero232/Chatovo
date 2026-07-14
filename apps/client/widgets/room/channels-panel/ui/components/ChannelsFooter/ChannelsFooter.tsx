'use client';

import { useTranslations } from 'next-intl';

import { UserAvatar, UserName, useCurrentUser } from '@/entities/auth/user';
import { ReportProblemButton } from '@/features/app/report-problem';
import { AppSettingsButton } from '@/widgets/app/app-settings';

import s from './ChannelsFooter.module.scss';

export const ChannelsFooter = () => {
  const t = useTranslations('channels');
  const { avatarUrl, displayName, verified } = useCurrentUser();

  return (
    <div className={s.root}>
      <UserAvatar
        name={displayName}
        src={avatarUrl}
        className={s.avatar}
        fallbackClassName={s.fallback}
      />
      <div className={s.info}>
        <UserName name={displayName} verified={verified} className={s.name} />
        <span className={s.status}>
          <span className={s.dot}>
            <span className={s.dotPing} />
            <span className={s.dotCore} />
          </span>
          {t('online')}
        </span>
      </div>

      <div className={s.actions}>
        <ReportProblemButton />
        <AppSettingsButton />
      </div>
    </div>
  );
};
