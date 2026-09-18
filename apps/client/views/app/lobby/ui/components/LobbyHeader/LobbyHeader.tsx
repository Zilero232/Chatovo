'use client';

import { clsx } from 'clsx';
import { Server, Sparkles, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useLobbyOnline } from '@/entities/room/room';
import { useServers } from '@/entities/server/server';
import { env } from '@/shared/config';
import { appEvents } from '@/shared/lib';
import { Tooltip, TooltipContent } from '@/ui-kit';

import { LobbyGreeting, LobbyStat } from './components';

import s from './LobbyHeader.module.scss';

export const LobbyHeader = () => {
  const t = useTranslations('lobby');
  const tStats = useTranslations('lobby.stats');

  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  appEvents.on.recheckUpdate(() => setIsCheckingUpdate(true));
  appEvents.on.updateCheckSettled(() => setIsCheckingUpdate(false));

  const { servers, isLoading } = useServers();
  const lobbyOnline = useLobbyOnline();

  const members = servers.reduce((total, server) => total + server.memberCount, 0);

  return (
    <div className={clsx(s.root, 'glass')}>
      <div aria-hidden className='lobby-header-grid' />
      <div aria-hidden className={s.accent} />
      <div aria-hidden className={s.wash} />
      <div aria-hidden className={s.washAlt} />

      <div className={s.inner}>
        <div className={s.topRow}>
          <LobbyGreeting />

          <Tooltip>
            <button aria-label={t('appVersion')} className={s.versionPill} type='button'>
              <Sparkles
                aria-hidden
                className={clsx(s.versionIcon, isCheckingUpdate && s.versionIconChecking)}
              />
              <span className={s.versionText}>v{env.NEXT_PUBLIC_APP_VERSION}</span>
            </button>
            <TooltipContent>{t('appVersion')}</TooltipContent>
          </Tooltip>
        </div>

        <div className={s.stats}>
          <LobbyStat
            icon={<Server className={s.statIconMuted} />}
            isLoading={isLoading}
            label={tStats('servers')}
            tone='rooms'
            value={servers.length}
          />

          <LobbyStat
            icon={<Users className={s.statIconMuted} />}
            isLoading={isLoading}
            label={tStats('members')}
            tone='live'
            value={members}
          />

          <LobbyStat
            icon={<span className={s.statPulse} />}
            label={tStats('online')}
            tone='online'
            value={lobbyOnline}
          />
        </div>
      </div>
    </div>
  );
};
