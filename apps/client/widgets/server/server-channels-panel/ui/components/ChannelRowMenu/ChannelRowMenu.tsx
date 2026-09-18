'use client';

import {
  ArrowDown,
  ArrowUp,
  Bell,
  BellOff,
  Check,
  MoreHorizontal,
  Pencil,
  Shield,
  Trash2
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { isNullish } from 'remeda';

import { useToastError } from '@/entities/app/locale';
import { useMarkChannelRead, useMuteChannel, useReorderChannels } from '@/entities/server/channel';
import {
  ChannelDialog,
  ChannelPermissionsDialog,
  DeleteChannelDialog
} from '@/features/server/manage-channel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui-kit';

import type { ChannelRowMenuProps } from './ChannelRowMenu.types';

type OpenDialog = 'delete' | 'edit' | 'permissions' | null;

const MUTE_HOURS = 8;

export const ChannelRowMenu = ({
  channel,
  serverId,
  siblings,
  siblingIndex,
  isMuted,
  canManage,
  className
}: ChannelRowMenuProps) => {
  const t = useTranslations('server.channels');
  const toastError = useToastError();

  const markReadMutation = useMarkChannelRead(serverId);
  const muteMutation = useMuteChannel(serverId);
  const reorderMutation = useReorderChannels(serverId);

  const [dialog, setDialog] = useState<OpenDialog>(null);

  const close = () => setDialog(null);

  const move = (direction: -1 | 1) => {
    const other = siblings[siblingIndex + direction];

    if (isNullish(other)) {
      return;
    }

    reorderMutation.mutate(
      {
        channels: [
          { id: channel.id, position: other.position },
          { id: other.id, position: channel.position }
        ]
      },
      { onError: toastError(`channel-reorder-${channel.id}`) }
    );
  };

  const toggleMute = () => {
    const mutedUntil = isMuted ? null : new Date(Date.now() + MUTE_HOURS * 3_600_000).toISOString();

    muteMutation.mutate(
      { channelId: channel.id, mutedUntil },
      { onError: toastError(`mute-${channel.id}`) }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t('editChannel')}
          className={className}
          size='icon-xs'
          variant='ghost'
          onPointerDown={(event) => event.stopPropagation()}
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' onClick={(event) => event.stopPropagation()}>
          <DropdownMenuItem onSelect={() => markReadMutation.mutate({ channelId: channel.id })}>
            <Check />
            {t('markRead')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={toggleMute}>
            {isMuted ? <Bell /> : <BellOff />}
            {isMuted ? t('unmute') : t('mute')}
          </DropdownMenuItem>
          {canManage && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={siblingIndex === 0} onSelect={() => move(-1)}>
                <ArrowUp />
                {t('moveUp')}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={siblingIndex >= siblings.length - 1}
                onSelect={() => move(1)}
              >
                <ArrowDown />
                {t('moveDown')}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDialog('edit')}>
                <Pencil />
                {t('editChannel')}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDialog('permissions')}>
                <Shield />
                {t('permissions')}
              </DropdownMenuItem>
              <DropdownMenuItem variant='destructive' onSelect={() => setDialog('delete')}>
                <Trash2 />
                {t('deleteChannel')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ChannelDialog
        channel={channel}
        open={dialog === 'edit'}
        serverId={serverId}
        onOpenChange={close}
      />
      <ChannelPermissionsDialog
        channel={channel}
        open={dialog === 'permissions'}
        serverId={serverId}
        onOpenChange={close}
      />
      <DeleteChannelDialog
        channel={channel}
        open={dialog === 'delete'}
        serverId={serverId}
        onOpenChange={close}
      />
    </>
  );
};
