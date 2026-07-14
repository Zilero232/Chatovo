'use client';

import { useTranslations } from 'next-intl';
import s from './MessageBody.module.scss';
import type { MessageBodyProps } from './MessageBody.types';

export const MessageBody = ({ bubble, isDeleted }: MessageBodyProps) => {
  const t = useTranslations('chat');

  if (isDeleted) {
    return <div className={s.deleted}>{t('deletedPlaceholder')}</div>;
  }

  return bubble;
};
