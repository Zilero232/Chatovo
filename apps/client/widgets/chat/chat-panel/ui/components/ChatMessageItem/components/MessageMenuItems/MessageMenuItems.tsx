'use client';

import { CornerDownRight, Pencil, Pin, PinOff, ShieldAlert, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ContextMenuItem, ContextMenuSeparator } from '@/ui-kit';

import { useChatMessage } from '../../../../../model/contexts';

export const MessageMenuItems = () => {
  const t = useTranslations('chat');
  const tModeration = useTranslations('moderation');
  const {
    canEdit,
    canPin,
    canReply,
    canReport,
    isPinned,
    showActions,
    startEdit,
    requestDelete,
    reportAbuse,
    reply,
    togglePin
  } = useChatMessage();

  return (
    <>
      {canReply && (
        <ContextMenuItem onSelect={reply}>
          <CornerDownRight />
          {t('reply')}
        </ContextMenuItem>
      )}

      {canEdit && (
        <ContextMenuItem onSelect={startEdit}>
          <Pencil />
          {t('edit')}
        </ContextMenuItem>
      )}

      {canPin && (
        <ContextMenuItem onSelect={togglePin}>
          {isPinned ? <PinOff /> : <Pin />}
          {isPinned ? t('unpin') : t('pin')}
        </ContextMenuItem>
      )}

      {(showActions || canReport) && <ContextMenuSeparator />}

      {showActions && (
        <ContextMenuItem variant='destructive' onSelect={requestDelete}>
          <Trash2 />
          {t('delete')}
        </ContextMenuItem>
      )}

      {canReport && (
        <ContextMenuItem variant='destructive' onSelect={reportAbuse}>
          <ShieldAlert />
          {tModeration('reportMessage')}
        </ContextMenuItem>
      )}
    </>
  );
};
