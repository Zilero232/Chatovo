'use client';

import { clsx } from 'clsx';
import { EyeOff, HeadphoneOff, MicOff, ScreenShare } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { UserAvatar, UserName } from '@/entities/auth/user';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { FriendProfileActionsPanel } from '@/widgets/social/friend-profile-actions-panel';

import type { ParticipantCardProps } from './ParticipantCard.types';

import { useParticipantAudioLevel, useParticipantMedia } from '../../../model/hooks';
import { CardVideo } from '../CardVideo/CardVideo';
import { ParticipantCardMenu } from '../ParticipantCardMenu/ParticipantCardMenu';
import { VoiceLevelRing } from '../VoiceLevelRing/VoiceLevelRing';
import { getCardTint } from './lib';

import s from './ParticipantCard.module.scss';

export const ParticipantCard = ({
  participant,
  deafened,
  invisible = false,
  fill = false
}: ParticipantCardProps) => {
  const t = useTranslations('room');
  const tLobby = useTranslations('lobby.card');

  const {
    cameraTrack,
    screenTrack,
    isSpeaking,
    micMuted,
    verified,
    developer,
    avatarUrl,
    bannerColor,
    displayName,
    isLocal,
    hasCamera,
    hasScreen,
    hasVideo
  } = useParticipantMedia(participant);

  const setAudioStage = useParticipantAudioLevel<HTMLDivElement>(participant);

  return (
    <ParticipantCardMenu participant={participant}>
      <div
        className={clsx(s.root, { [s.rootFill]: fill, [s.rootInvisible]: invisible })}
        data-local={isLocal}
        data-speaking={isSpeaking}
      >
        <div className={s.stage}>
          {hasVideo ? (
            <div className={s.videoGrid}>
              {hasCamera && cameraTrack && <CardVideo trackRef={cameraTrack} />}
              {hasScreen && screenTrack && <CardVideo trackRef={screenTrack} />}
            </div>
          ) : (
            <div ref={setAudioStage} className={s.audioStage}>
              <span aria-hidden className={s.tint} style={getCardTint(bannerColor)} />
              <span
                aria-hidden
                className={clsx(s.avatarHalo, {
                  [s.avatarHaloSpeaking]: isSpeaking,
                  [s.avatarHaloLocalSpeaking]: isLocal && isSpeaking
                })}
              />
              <VoiceLevelRing speaking={isSpeaking} />

              <UserAvatar
                className={clsx(s.avatar, { [s.avatarSpeaking]: isSpeaking })}
                fallbackClassName={s.avatarFallback}
                name={displayName}
                src={avatarUrl}
              />
            </div>
          )}
        </div>

        {(hasScreen || invisible) && (
          <div className={s.badges}>
            {invisible && (
              <span className={clsx(s.badge, s.badgeInvisible)}>
                <EyeOff className={s.badgeIcon} />
                {t('invisibleBadge')}
              </span>
            )}
            {hasScreen && (
              <span className={s.badge}>
                <ScreenShare className={s.badgeIcon} />
                share
              </span>
            )}
          </div>
        )}

        <div className={s.metadata}>
          {micMuted && <MicOff aria-label={tLobby('micMuted')} className={s.micIcon} role='img' />}
          {deafened && (
            <HeadphoneOff aria-label={tLobby('deafened')} className={s.micIcon} role='img' />
          )}
          <ProfileCardTrigger
            className={s.nameTrigger}
            identity={participant.identity}
            name={displayName}
            renderFriendActions={(state) => <FriendProfileActionsPanel {...state} />}
          >
            <UserName
              className={s.name}
              developer={developer}
              name={displayName}
              verified={verified}
            />
          </ProfileCardTrigger>
        </div>
      </div>
    </ParticipantCardMenu>
  );
};
