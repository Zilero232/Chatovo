'use client';

import { CornerDownRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/ui-kit';

import type { ComposerReplyBarProps } from './ComposerReplyBar.types';

import s from './ComposerReplyBar.module.scss';

export const ComposerReplyBar = ({ replyTo, onCancel }: ComposerReplyBarProps) => {
  const t = useTranslations('chat');

  return (
    <div className={s.root}>
      <CornerDownRight aria-hidden className={s.icon} />
      <span className={s.label}>
        {t('replyingTo', { name: replyTo.from?.name ?? t('deletedPlaceholder') })}
      </span>
      <span className={s.body}>{replyTo.message}</span>
      <Button
        aria-label={t('cancelReply')}
        size='icon-xs'
        type='button'
        variant='ghost'
        onClick={onCancel}
      >
        <X />
      </Button>
    </div>
  );
};
