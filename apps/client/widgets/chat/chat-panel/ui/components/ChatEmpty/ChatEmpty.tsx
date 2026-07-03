'use client';

import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CenteredState } from '@/shared/ui';

export const ChatEmpty = () => {
  const t = useTranslations('chat.empty');

  return (
    <CenteredState
      className="py-10"
      description={t('description')}
      icon={<MessageSquare className="size-5" />}
      size="sm"
      title={t('title')}
    />
  );
};
