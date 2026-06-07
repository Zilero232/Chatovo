'use client';

import {
  useIsMuted,
  useIsSpeaking,
  useParticipantInfo,
  useParticipantTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { HeadphoneOff, MicOff, ScreenShare } from 'lucide-react';
import { isNonNullish } from 'remeda';
import { UserAvatar, UserName } from '@/entities/auth/user';
import { readParticipantMeta } from '@/entities/room/room';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { cn } from '@/shared/lib';
import { CardVideo } from '../CardVideo';
import { ParticipantCardMenu } from '../ParticipantCardMenu';
import { getCardTint } from './lib';
import { participantCardStyles as s } from './ParticipantCard.styles';
import type { ParticipantCardProps } from './ParticipantCard.types';

export const ParticipantCard = ({ participant, deafened, index = 0 }: ParticipantCardProps) => {
  const [cameraTrack] = useParticipantTracks([Track.Source.Camera], participant.identity);
  const [screenTrack] = useParticipantTracks([Track.Source.ScreenShare], participant.identity);
  const [micTrack] = useParticipantTracks([Track.Source.Microphone], participant.identity);

  const isSpeaking = useIsSpeaking(participant);
  const micMuted = useIsMuted(micTrack ?? { participant, source: Track.Source.Microphone });
  const cameraMuted = useIsMuted(cameraTrack ?? { participant, source: Track.Source.Camera });
  const screenMuted = useIsMuted(screenTrack ?? { participant, source: Track.Source.ScreenShare });

  const { name, metadata } = useParticipantInfo({ participant });
  const { verified, avatarUrl, bannerColor } = readParticipantMeta(metadata);

  const displayName = name || participant.identity;

  const hasCamera = isNonNullish(cameraTrack) && !cameraMuted;
  const hasScreen = isNonNullish(screenTrack) && !screenMuted;
  const hasVideo = hasCamera || hasScreen;

  return (
    <ParticipantCardMenu participant={participant}>
      <div
        className={s.root}
        data-speaking={isSpeaking}
        style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
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
              <span aria-hidden className={cn(s.avatarHalo, isSpeaking && s.avatarHaloSpeaking)} />

              <UserAvatar
                name={displayName}
                src={avatarUrl}
                className={cn(s.avatar, isSpeaking && s.avatarSpeaking)}
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
          <ProfileCardTrigger identity={participant.identity} name={displayName}>
            <button className={s.nameTrigger} type="button">
              <UserName name={displayName} verified={verified} className={s.name} />
            </button>
          </ProfileCardTrigger>
        </div>
      </div>
    </ParticipantCardMenu>
  );
};
