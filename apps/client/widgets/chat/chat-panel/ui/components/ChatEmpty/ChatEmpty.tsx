'use client';

import { Hash, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isNonNullish } from 'remeda';

import type { ChatEmptyProps } from './ChatEmpty.types';

import s from './ChatEmpty.module.scss';

export const ChatEmpty = ({ channelName }: ChatEmptyProps) => {
  const t = useTranslations('chat.empty');

  if (isNonNullish(channelName)) {
    return (
      <div className={s.channel}>
        <span aria-hidden className={s.badge}>
          <Hash />
        </span>

        <h2 className={s.heading}>{t('channelTitle', { name: channelName })}</h2>
        <p className={s.subtitle}>{t('channelDescription', { name: channelName })}</p>
      </div>
    );
  }

  return (
    <div className={s.channel}>
      <span aria-hidden className={s.badge}>
        <MessageSquare />
      </span>

      <h2 className={s.heading}>{t('title')}</h2>
      <p className={s.subtitle}>{t('description')}</p>
    </div>
  );
};
