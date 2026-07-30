'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui';

import type { MessageActionsProps } from './MessageActions.types';

import s from './MessageActions.module.scss';

export const MessageActions = ({ canEdit, onEdit, onDelete }: MessageActionsProps) => {
  const t = useTranslations('chat');

  return (
    <div className={s.root}>
      {canEdit && (
        <Button aria-label={t('edit')} size='icon-xs' variant='ghost' onClick={onEdit}>
          <Pencil />
        </Button>
      )}
      <Button aria-label={t('delete')} size='icon-xs' variant='ghost' onClick={onDelete}>
        <Trash2 />
      </Button>
    </div>
  );
};
