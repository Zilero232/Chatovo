'use client';

import { RefreshCw, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, CenteredState } from '@/ui-kit';

import type { ChatErrorProps } from './ChatError.types';

export const ChatError = ({ onRetry }: ChatErrorProps) => {
  const t = useTranslations('chat.error');

  return (
    <CenteredState
      action={
        <Button size='sm' type='button' variant='outline' onClick={onRetry}>
          <RefreshCw />
          {t('retry')}
        </Button>
      }
      description={t('description')}
      icon={<TriangleAlert />}
      size='sm'
      title={t('title')}
    />
  );
};
