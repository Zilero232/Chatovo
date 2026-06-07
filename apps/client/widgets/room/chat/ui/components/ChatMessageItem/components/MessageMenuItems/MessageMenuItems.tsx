'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ContextMenuItem } from '@/shared/ui';
import type { MessageMenuItemsProps } from './MessageMenuItems.types';

export const MessageMenuItems = ({ canEdit, onEdit, onDelete }: MessageMenuItemsProps) => {
  const t = useTranslations('chat');

  return (
    <>
      {canEdit && (
        <ContextMenuItem onSelect={onEdit}>
          <Pencil />
          {t('edit')}
        </ContextMenuItem>
      )}
      <ContextMenuItem variant="destructive" onSelect={onDelete}>
        <Trash2 />
        {t('delete')}
      </ContextMenuItem>
    </>
  );
};
