'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { isNonNullish } from 'remeda';
import { match, P } from 'ts-pattern';

import { useCurrentUser } from '@/entities/auth/user';
import { buildServerHref } from '@/shared/lib';
import { Button, Spinner } from '@/ui-kit';

import type { ProfileVoiceBlockProps } from './ProfileVoiceBlock.types';

import { useParticipantRoom } from '../../../../model/hooks';

import s from './ProfileVoiceBlock.module.scss';

export const ProfileVoiceBlock = ({ identity, isSelf }: ProfileVoiceBlockProps) => {
  const router = useRouter();

  const t = useTranslations('profileCard');

  const { user } = useCurrentUser();

  const { room, isLoading } = useParticipantRoom(identity);
  const { room: myRoom } = useParticipantRoom(user?.id ?? '');

  const inSameRoom = isNonNullish(room) && room.roomId === myRoom?.roomId;

  return (
    <div className={s.root}>
      {match({ isLoading, isSelf, room, inSameRoom })
        .with({ isLoading: true }, () => (
          <span className={s.label}>
            <Spinner size='xs' />
          </span>
        ))
        .with({ isSelf: true }, () => (
          <>
            <span className={s.label}>{room ? t('inVoice') : t('notInVoice')}</span>
            {room && <span className={s.room}>{room.roomName}</span>}
            <span className={s.label}>{t('openSettingsHint')}</span>
          </>
        ))
        .with({ room: P.nullish }, () => <span className={s.label}>{t('notInVoice')}</span>)
        .with({ room: P.nonNullable }, ({ room: current, inSameRoom: same }) => (
          <>
            <span className={s.label}>{t('inVoice')}</span>
            <span className={s.room}>{current.roomName}</span>
            {!same && (
              <Button
                className={s.button}
                size='sm'
                onClick={() =>
                  router.push(buildServerHref(current.serverId, { channelId: current.roomId }))
                }
              >
                {t('join')}
              </Button>
            )}
          </>
        ))
        .exhaustive()}
    </div>
  );
};
