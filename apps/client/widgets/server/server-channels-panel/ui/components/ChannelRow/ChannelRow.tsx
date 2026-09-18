'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import { BellOff, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ChannelIcon } from '@/entities/server/channel';
import { useJoinVoiceChannel } from '@/features/server/join-voice';
import { buildServerHref } from '@/shared/lib';

import type { ChannelRowProps } from './ChannelRow.types';

import { useChannelUnread } from '../../../model/hooks';
import { ChannelRowMenu } from '../ChannelRowMenu/ChannelRowMenu';
import { VoiceChannelMembers } from '../VoiceChannelMembers/VoiceChannelMembers';

import s from './ChannelRow.module.scss';

export const ChannelRow = ({
  channel,
  serverId,
  siblings,
  siblingIndex,
  isActive,
  canManage,
  onNavigate
}: ChannelRowProps) => {
  const router = useRouter();

  const { join, activeChannelId } = useJoinVoiceChannel();
  const { hasUnread, isMuted } = useChannelUnread({ serverId, channelId: channel.id });
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: channel.id,
    disabled: !canManage
  });

  const isVoice = channel.type === 'voice';
  const isConnected = isVoice && activeChannelId === channel.id;

  const open = () => {
    if (isVoice) {
      join(channel);
    }

    router.push(buildServerHref(serverId, { channelId: channel.id }));
    onNavigate?.();
  };

  return (
    <div
      ref={setNodeRef}
      className={clsx(s.root, { [s.dragging]: isDragging })}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      <div className={s.row}>
        <button
          className={clsx(s.trigger, {
            [s.active]: isActive,
            [s.unread]: hasUnread && !isActive,
            [s.muted]: isMuted,
            [s.connected]: isConnected
          })}
          aria-current={isActive ? 'page' : undefined}
          type='button'
          onClick={open}
        >
          <ChannelIcon className={s.icon} type={channel.type} />
          <span className={s.name}>{channel.name}</span>
          {channel.isPrivate && <Lock aria-hidden className={s.badge} />}
          {isMuted && <BellOff aria-hidden className={s.badge} />}
          {hasUnread && !isActive && <span aria-hidden className={s.dot} />}
        </button>

        <ChannelRowMenu
          canManage={canManage}
          channel={channel}
          className={s.menu}
          isMuted={isMuted}
          serverId={serverId}
          siblingIndex={siblingIndex}
          siblings={siblings}
        />
      </div>

      {isVoice && <VoiceChannelMembers channelId={channel.id} />}
    </div>
  );
};
