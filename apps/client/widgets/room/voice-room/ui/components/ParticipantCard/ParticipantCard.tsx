'use client';

import { clsx } from 'clsx';
import { HeadphoneOff, MicOff, ScreenShare } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { UserAvatar, UserName } from '@/entities/auth/user';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { useParticipantMedia } from '../../../model/hooks';
import { CardVideo } from '../CardVideo';
import { ParticipantCardMenu } from '../ParticipantCardMenu';
import { getCardTint } from './lib';

import s from './ParticipantCard.module.scss';

import type { ParticipantCardProps } from './ParticipantCard.types';

export const ParticipantCard = ({ participant, deafened, fill = false }: ParticipantCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  const {
    cameraTrack,
    screenTrack,
    isSpeaking,
    micMuted,
    verified,
    avatarUrl,
    bannerColor,
    displayName,
    isLocal,
    hasCamera,
    hasScreen,
    hasVideo,
  } = useParticipantMedia(participant);

  return (
    <ParticipantCardMenu participant={participant}>
      <motion.div
        layout
        className={clsx(s.root, { [s.rootFill]: fill })}
        data-local={isLocal}
        data-speaking={isSpeaking}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      >
        <div className={s.stage}>
          {hasVideo ? (
            <div className={s.videoGrid}>
              {hasCamera && cameraTrack && <CardVideo trackRef={cameraTrack} />}
              {hasScreen && screenTrack && <CardVideo trackRef={screenTrack} />}
            </div>
          ) : (
            <div className={s.audioStage}>
              <span aria-hidden className={s.tint} style={getCardTint(bannerColor)} />
              <span
                aria-hidden
                className={clsx(s.avatarHalo, {
                  [s.avatarHaloSpeaking]: isSpeaking,
                  [s.avatarHaloLocalSpeaking]: isLocal && isSpeaking,
                })}
              />

              <UserAvatar
                name={displayName}
                src={avatarUrl}
                className={clsx(s.avatar, { [s.avatarSpeaking]: isSpeaking })}
                fallbackClassName={s.avatarFallback}
              />
            </div>
          )}
        </div>

        {hasScreen && (
          <div className={s.badges}>
            <span className={s.badge}>
              <ScreenShare className={s.badgeIcon} />
              share
            </span>
          </div>
        )}

        <div className={s.metadata}>
          {micMuted && <MicOff className={s.micIcon} />}
          {deafened && <HeadphoneOff className={s.micIcon} />}
          <ProfileCardTrigger
            className={s.nameTrigger}
            identity={participant.identity}
            name={displayName}
          >
            <UserName name={displayName} verified={verified} className={s.name} />
          </ProfileCardTrigger>
        </div>
      </motion.div>
    </ParticipantCardMenu>
  );
};
