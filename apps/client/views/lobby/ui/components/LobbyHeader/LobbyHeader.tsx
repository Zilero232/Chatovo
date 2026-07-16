'use client';

import { clsx } from 'clsx';
import { Radio, Sparkles, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useLobbyOnline, useRooms, useRoomsPresence } from '@/entities/room/room';
import { env } from '@/shared/config';
import { Tooltip, TooltipContent } from '@/shared/ui';
import { LobbyGreeting, LobbyStat } from './components';

import s from './LobbyHeader.module.scss';

export const LobbyHeader = () => {
  const t = useTranslations('lobby');
  const tStats = useTranslations('lobby.stats');

  const { rooms } = useRooms();
  const presence = useRoomsPresence();
  const lobbyOnline = useLobbyOnline();

  const liveRooms = rooms.filter((room) => (presence[room.id]?.length ?? 0) > 0).length;

  return (
    <div className={clsx(s.root, 'glass')}>
      <div aria-hidden className="lobby-header-grid" />
      <div aria-hidden className={s.accent} />
      <div aria-hidden className={s.wash} />
      <div aria-hidden className={s.washAlt} />

      <div className={s.inner}>
        <div className={s.topRow}>
          <LobbyGreeting />

          <Tooltip>
            <button aria-label={t('appVersion')} className={s.versionPill} type="button">
              <Sparkles aria-hidden className={s.versionIcon} />
              <span className={s.versionText}>v{env.NEXT_PUBLIC_APP_VERSION}</span>
            </button>
            <TooltipContent>{t('appVersion')}</TooltipContent>
          </Tooltip>
        </div>

        <div className={s.stats}>
          <LobbyStat
            icon={<Users className={s.statIconMuted} />}
            label={tStats('rooms')}
            tone="rooms"
            value={rooms.length}
          />

          <LobbyStat
            icon={<Radio className={liveRooms > 0 ? s.statIconLive : s.statIconMuted} />}
            label={tStats('live')}
            tone="live"
            value={liveRooms}
          />

          <LobbyStat
            icon={<span className={s.statPulse} />}
            label={tStats('online')}
            tone="online"
            value={lobbyOnline}
          />
        </div>
      </div>
    </div>
  );
};
