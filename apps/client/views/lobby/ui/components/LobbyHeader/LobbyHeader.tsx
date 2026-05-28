'use client';

import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCurrentUser } from '@/entities/auth/user';
import { env } from '@/shared/config';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import { lobbyHeaderStyles as s } from './LobbyHeader.styles';

export const LobbyHeader = () => {
  const t = useTranslations('lobby');

  const { displayName } = useCurrentUser();

  return (
    <div className={s.root}>
      <div className={s.text}>
        <h2 className={s.title}>{t('welcome', { name: displayName })}</h2>
        <p className={s.subtitle}>{t('subtitle')}</p>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className={s.versionPill}>
            <Sparkles className={s.versionIcon} />
            <span className={s.versionLabel}>v{env.NEXT_PUBLIC_APP_VERSION}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent>{t('appVersion')}</TooltipContent>
      </Tooltip>
    </div>
  );
};
