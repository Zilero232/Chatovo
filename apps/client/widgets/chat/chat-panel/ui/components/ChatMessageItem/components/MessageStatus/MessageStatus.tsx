'use client';

import { CircleAlert, Clock3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import s from './MessageStatus.module.scss';

import type { MessageStatusProps } from './MessageStatus.types';

export const MessageStatus = ({ status, onRetry, onDiscard }: MessageStatusProps) => {
  const t = useTranslations('chat');

  return match(status)
    .with('sending', () => (
      <span className={s.root}>
        <Clock3 className={s.icon} />
        {t('sending')}
      </span>
    ))
    .with('failed', () => (
      <span className={s.root} data-failed>
        <CircleAlert className={s.icon} />
        {t('sendFailed')}

        <button className={s.action} type="button" onClick={onRetry}>
          {t('retry')}
        </button>

        <button className={s.action} type="button" onClick={onDiscard}>
          {t('discard')}
        </button>
      </span>
    ))
    .exhaustive();
};
