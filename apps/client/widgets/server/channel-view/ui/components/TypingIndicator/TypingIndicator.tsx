'use client';

import { useTranslations } from 'next-intl';

import { useTypingUsers } from '@/entities/server/channel';
import { useServerMembers } from '@/entities/server/member';

import type { TypingIndicatorProps } from './TypingIndicator.types';

import s from './TypingIndicator.module.scss';

export const TypingIndicator = ({ serverId, channelId, threadId }: TypingIndicatorProps) => {
  const t = useTranslations('chat');

  const { members } = useServerMembers(serverId);
  const typing = useTypingUsers({ channelId, threadId });

  if (typing.length === 0) {
    return null;
  }

  const names = typing.map(
    (userId) => members.find((member) => member.userId === userId)?.displayName ?? '…'
  );

  return (
    <p aria-live='polite' className={s.root}>
      <span aria-hidden className={s.dots}>
        <span />
        <span />
        <span />
      </span>
      {names.length === 1
        ? t('typingOne', { name: names[0] })
        : t('typingMany', { count: names.length })}
    </p>
  );
};
