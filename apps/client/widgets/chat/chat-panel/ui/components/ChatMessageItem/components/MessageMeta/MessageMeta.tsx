'use client';

import { UserName } from '@/entities/auth/user';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { formatMessageTime } from '@/shared/lib/format-date';

import type { MessageMetaProps } from './MessageMeta.types';

import s from './MessageMeta.module.scss';

export const MessageMeta = ({ author, identity, timestamp, verified, isOwn }: MessageMetaProps) => (
  <div className={s.root}>
    {!isOwn && (
      <ProfileCardTrigger className={s.nameTrigger} identity={identity} name={author}>
        <UserName className={s.author} name={author} verified={verified} />
      </ProfileCardTrigger>
    )}
    <span className={s.time}>{formatMessageTime(timestamp)}</span>
  </div>
);
