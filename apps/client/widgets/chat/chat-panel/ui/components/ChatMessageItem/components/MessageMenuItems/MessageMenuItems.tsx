'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ContextMenuItem } from '@/ui-kit';

import { useChatMessage } from '../../../../../model/contexts';

export const MessageMenuItems = () => {
  const t = useTranslations('chat');
  const { canEdit, startEdit, requestDelete } = useChatMessage();

  return (
    <>
      {canEdit && (
        <ContextMenuItem onSelect={startEdit}>
          <Pencil />
          {t('edit')}
        </ContextMenuItem>
      )}
      <ContextMenuItem variant='destructive' onSelect={requestDelete}>
        <Trash2 />
        {t('delete')}
      </ContextMenuItem>
    </>
  );
};
