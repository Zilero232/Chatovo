'use client';

import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CenteredState } from '@/ui-kit';

import s from './ChatEmpty.module.scss';

export const ChatEmpty = () => {
  const t = useTranslations('chat.empty');

  return (
    <CenteredState
      className={s.root}
      description={t('description')}
      icon={<MessageSquare className={s.icon} />}
      pattern='waveform'
      size='sm'
      title={t('title')}
    />
  );
};
