'use client';

import {
  Archive,
  ArchiveRestore,
  Lock,
  LockOpen,
  MoreHorizontal,
  Pin,
  PinOff,
  Trash2
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useToastError } from '@/entities/app/locale';
import { useDeleteThread, useUpdateThread } from '@/entities/server/thread';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui-kit';

import type { ThreadMenuProps } from './ThreadMenu.types';

export const ThreadMenu = ({ thread, canManage, className }: ThreadMenuProps) => {
  const t = useTranslations('server.threads');
  const toastError = useToastError();

  const updateMutation = useUpdateThread(thread.channelId);
  const deleteMutation = useDeleteThread(thread.channelId);

  const patch = (input: Parameters<typeof updateMutation.mutate>[0]['input']) => {
    updateMutation.mutate(
      { threadId: thread.id, input },
      { onError: toastError(`thread-update-${thread.id}`) }
    );
  };

  const isArchived = thread.archivedAt !== null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('title')}
        className={className}
        size='icon-xs'
        variant='ghost'
        onPointerDown={(event) => event.stopPropagation()}
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' onClick={(event) => event.stopPropagation()}>
        {canManage && (
          <DropdownMenuItem onSelect={() => patch({ pinned: !thread.pinned })}>
            {thread.pinned ? <PinOff /> : <Pin />}
            {thread.pinned ? t('unpin') : t('pin')}
          </DropdownMenuItem>
        )}
        {canManage && (
          <DropdownMenuItem onSelect={() => patch({ locked: !thread.locked })}>
            {thread.locked ? <LockOpen /> : <Lock />}
            {thread.locked ? t('unlock') : t('lock')}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => patch({ archived: !isArchived })}>
          {isArchived ? <ArchiveRestore /> : <Archive />}
          {isArchived ? t('unarchive') : t('archive')}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant='destructive'
          onSelect={() =>
            deleteMutation.mutate(thread.id, { onError: toastError(`thread-delete-${thread.id}`) })
          }
        >
          <Trash2 />
          {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
