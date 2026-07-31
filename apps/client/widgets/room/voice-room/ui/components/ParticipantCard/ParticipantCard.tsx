'use client';

import { clsx } from 'clsx';
import { HeadphoneOff, MicOff, ScreenShare } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { UserAvatar, UserName } from '@/entities/auth/user';
import { ProfileCardTrigger } from '@/features/room/profile-card';

import type { ParticipantCardProps } from './ParticipantCard.types';

import { useParticipantMedia } from '../../../model/hooks';
import { CardVideo } from '../CardVideo/CardVideo';
import { ParticipantCardMenu } from '../ParticipantCardMenu/ParticipantCardMenu';
import { getCardTint } from './lib';
import {
  PARTICIPANT_CARD_ANIMATE,
  PARTICIPANT_CARD_HIDDEN,
  PARTICIPANT_CARD_REDUCED_HIDDEN,
  PARTICIPANT_CARD_TRANSITION
} from './ParticipantCard.motion';

import s from './ParticipantCard.module.scss';

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
    hasVideo
  } = useParticipantMedia(participant);

  return (
    <ParticipantCardMenu participant={participant}>
      <motion.div
        layout
        animate={PARTICIPANT_CARD_ANIMATE}
        className={clsx(s.root, { [s.rootFill]: fill })}
        data-local={isLocal}
        data-speaking={isSpeaking}
        exit={shouldReduceMotion ? PARTICIPANT_CARD_REDUCED_HIDDEN : PARTICIPANT_CARD_HIDDEN}
        initial={shouldReduceMotion ? PARTICIPANT_CARD_REDUCED_HIDDEN : PARTICIPANT_CARD_HIDDEN}
        transition={PARTICIPANT_CARD_TRANSITION}
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
                  [s.avatarHaloLocalSpeaking]: isLocal && isSpeaking
                })}
              />

              <UserAvatar
                className={clsx(s.avatar, { [s.avatarSpeaking]: isSpeaking })}
                fallbackClassName={s.avatarFallback}
                name={displayName}
                src={avatarUrl}
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
            <UserName className={s.name} name={displayName} verified={verified} />
          </ProfileCardTrigger>
        </div>
      </motion.div>
    </ParticipantCardMenu>
  );
};
