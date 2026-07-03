'use client';

import NumberFlow from '@number-flow/react';
import { Radio, Sparkles, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { UserAvatar, useCurrentUser } from '@/entities/auth/user';
import { useLobbyOnline, useRooms, useRoomsPresence } from '@/entities/room/room';
import { env } from '@/shared/config';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import { lobbyHeaderStyles as s } from './LobbyHeader.styles';

export const LobbyHeader = () => {
  const t = useTranslations('lobby');
  const tStats = useTranslations('lobby.stats');

  const { displayName, avatarUrl } = useCurrentUser();
  const { rooms } = useRooms();
  const presence = useRoomsPresence();
  const lobbyOnline = useLobbyOnline();

  const liveRooms = rooms.filter((room) => (presence[room.id]?.length ?? 0) > 0).length;
  const welcome = t('welcome', { name: displayName });
  const canHighlightName = displayName.length > 0 && welcome.includes(displayName);
  const welcomeLead = canHighlightName ? welcome.split(displayName)[0] : welcome;

  return (
    <div className={s.root}>
      <div aria-hidden className={s.grid} />
      <div aria-hidden className={s.accent} />
      <div aria-hidden className={s.wash} />
      <div aria-hidden className={s.washAlt} />

      <div className={s.inner}>
        <div className={s.topRow}>
          <div className={s.identity}>
            <div className={s.avatarWrap}>
              <UserAvatar
                name={displayName}
                src={avatarUrl}
                className={s.avatar}
                fallbackClassName={s.avatarFallback}
              />
            </div>

            <div className={s.text}>
              <h2 className={s.title}>
                {canHighlightName ? (
                  <>
                    {welcomeLead}
                    <span className={s.titleName}>{displayName}</span>
                  </>
                ) : (
                  <span className={s.titleName}>{welcomeLead}</span>
                )}
              </h2>
              <p className={s.subtitle}>{t('subtitle')}</p>
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className={s.versionPill} type="button">
                <Sparkles className={s.versionIcon} />
                <span className={s.versionText}>v{env.NEXT_PUBLIC_APP_VERSION}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>{t('appVersion')}</TooltipContent>
          </Tooltip>
        </div>

        <div className={s.stats}>
          <div className={s.stat} data-tone="rooms">
            <span aria-hidden className={s.statGlow} data-tone="rooms" />
            <span className={s.statIconWrap} data-tone="rooms">
              <Users className={s.statIconMuted} />
            </span>
            <span className={s.statTextWrap}>
              <NumberFlow className={s.statValue} value={rooms.length} />
              <span className={s.statLabel}>{tStats('rooms')}</span>
            </span>
          </div>

          <div className={s.stat} data-tone="live">
            <span aria-hidden className={s.statGlow} data-tone="live" />
            <span className={s.statIconWrap} data-tone="live">
              <Radio className={liveRooms > 0 ? s.statIconLive : s.statIconMuted} />
            </span>
            <span className={s.statTextWrap}>
              <NumberFlow className={s.statValue} value={liveRooms} />
              <span className={s.statLabel}>{tStats('live')}</span>
            </span>
          </div>

          <div className={s.stat} data-tone="online">
            <span aria-hidden className={s.statGlow} data-tone="online" />
            <span className={s.statIconWrap} data-tone="online">
              <span className={s.statPulse} />
            </span>
            <span className={s.statTextWrap}>
              <NumberFlow className={s.statValue} value={lobbyOnline} />
              <span className={s.statLabel}>{tStats('online')}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
