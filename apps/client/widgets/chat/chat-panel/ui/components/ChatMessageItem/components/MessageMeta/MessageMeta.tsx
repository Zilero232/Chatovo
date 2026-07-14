'use client';

import { UserName } from '@/entities/auth/user';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { formatMessageTime } from '@/shared/lib/format-date';

import s from './MessageMeta.module.scss';

import type { MessageMetaProps } from './MessageMeta.types';

export const MessageMeta = ({ author, identity, timestamp, verified, isOwn }: MessageMetaProps) => {
  return (
    <div className={s.root}>
      {!isOwn && (
        <ProfileCardTrigger identity={identity} name={author}>
          <button className={s.nameTrigger} type="button">
            <UserName name={author} verified={verified} className={s.author} />
          </button>
        </ProfileCardTrigger>
      )}
      <span className={s.time}>{formatMessageTime(timestamp)}</span>
    </div>
  );
};
