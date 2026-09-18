'use client';

import { Headphones, Maximize2, PhoneOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { isEmpty } from 'remeda';

import { UserAvatar } from '@/entities/auth/user';
import { useRoomParticipants } from '@/entities/room/room';
import { useJoinVoiceChannel } from '@/features/server/join-voice';
import { buildRoomHref } from '@/shared/lib';
import { Button, CenteredState, Row, Spinner } from '@/ui-kit';

import type { VoiceChannelBodyProps } from './VoiceChannelBody.types';

import s from './VoiceChannelBody.module.scss';

export const VoiceChannelBody = ({ channel }: VoiceChannelBodyProps) => {
  const router = useRouter();

  const t = useTranslations('server.channels');

  const participants = useRoomParticipants(channel.id);
  const { join, leave, activeChannelId, isPending } = useJoinVoiceChannel();

  const isConnected = activeChannelId === channel.id;

  return (
    <div className={s.root}>
      <CenteredState
        action={
          <Row wrap gap='2' justify='center'>
            {isConnected ? (
              <>
                <Button type='button' onClick={() => router.push(buildRoomHref(channel.id))}>
                  <Maximize2 />
                  {t('expandVoice')}
                </Button>
                <Button type='button' variant='destructive' onClick={leave}>
                  <PhoneOff />
                  {t('leaveVoice')}
                </Button>
              </>
            ) : (
              <Button disabled={isPending} type='button' onClick={() => join(channel)}>
                {isPending ? <Spinner decorative /> : <Headphones />}
                {t('joinVoice')}
              </Button>
            )}
          </Row>
        }
        description={
          isConnected ? t('connected') : isEmpty(participants) ? t('voiceEmpty') : undefined
        }
        icon={<Headphones />}
        pattern='waves'
        title={channel.name}
      />

      {!isEmpty(participants) && (
        <ul className={s.participants}>
          {participants.map((participant) => (
            <li key={participant.identity} className={s.participant}>
              <UserAvatar name={participant.name} size='lg' src={participant.avatarUrl} />
              <span className={s.participantName}>{participant.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
