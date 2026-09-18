'use client';

import { CornerDownRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useChatMessage } from '../../../../../model/contexts';

import s from './MessageReplyPreview.module.scss';

export const MessageReplyPreview = () => {
  const t = useTranslations('chat');
  const { repliedTo, message } = useChatMessage();

  if (!message.replyToId) {
    return null;
  }

  return (
    <div className={s.root}>
      <CornerDownRight aria-hidden className={s.icon} />
      {repliedTo ? (
        <>
          <span className={s.author}>{repliedTo.from?.name ?? t('deletedPlaceholder')}</span>
          <span className={s.body}>{repliedTo.message}</span>
        </>
      ) : (
        <span className={s.body}>{t('replyUnavailable')}</span>
      )}
    </div>
  );
};
