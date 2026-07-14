'use client';

import { clsx } from 'clsx';
import { MessageSquare, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui';
import s from './ChatHeader.module.scss';
import type { ChatHeaderProps } from './ChatHeader.types';

export const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  const t = useTranslations('chat');

  return (
    <header className={clsx('surface-bar', s.root)}>
      <span aria-hidden className="accent-top-line" />
      <div className={s.title}>
        <MessageSquare className={s.icon} />
        <span>{t('title')}</span>
      </div>
      <Button
        aria-label={t('close')}
        size="icon-sm"
        type="button"
        variant="ghost"
        onClick={onClose}
      >
        <X />
      </Button>
    </header>
  );
};
