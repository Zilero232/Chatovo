'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui';
import { messageActionsStyles as s } from './MessageActions.styles';
import type { MessageActionsProps } from './MessageActions.types';

export const MessageActions = ({ canEdit, onEdit, onDelete }: MessageActionsProps) => {
  const t = useTranslations('chat');

  return (
    <div className={s.root}>
      {canEdit && (
        <Button variant="ghost" size="icon-xs" aria-label={t('edit')} onClick={onEdit}>
          <Pencil />
        </Button>
      )}
      <Button variant="ghost" size="icon-xs" aria-label={t('delete')} onClick={onDelete}>
        <Trash2 />
      </Button>
    </div>
  );
};
