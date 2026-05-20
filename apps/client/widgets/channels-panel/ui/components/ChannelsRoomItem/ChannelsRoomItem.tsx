'use client';

import { Lock, Trash2, Volume2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useDeleteRoom, useRoomParticipants } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';
import { buildRoomHref, ROUTES } from '@/shared/constants';
import { getInitials } from '@/shared/lib';
import {
  Avatar,
  AvatarFallback,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/ui';
import { channelsRoomItemStyles as s } from './ChannelsRoomItem.styles';
import type { ChannelsRoomItemProps } from './ChannelsRoomItem.types';

export const ChannelsRoomItem = ({ room }: ChannelsRoomItemProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const { isAdmin } = useCurrentUser();

  const deleteMutation = useDeleteRoom();

  const activeRoomId = params.get('id');
  const isActive = activeRoomId === room.id;

  const { data: participants } = useRoomParticipants(room.id);

  const handleClick = () => router.push(buildRoomHref(room.id));

  const handleDelete = () => {
    deleteMutation.mutate(room.id, {
      onSuccess: () => {
        toast.success('Room deleted', { description: `"${room.name}"` });

        if (isActive) router.replace(ROUTES.lobby);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button className={s.trigger({ active: isActive })} type="button" onClick={handleClick}>
            <span className={s.triggerLabel}>
              <Volume2 className={s.icon({ active: isActive })} />
              {room.name}
              {room.isPrivate ? <Lock className={s.privateIcon} /> : null}
            </span>
            {isActive ? <span className={s.joinedBadge}>joined</span> : null}
          </button>
        </ContextMenuTrigger>
        {isAdmin ? (
          <ContextMenuContent>
            <ContextMenuItem variant="destructive" onSelect={handleDelete}>
              <Trash2 />
              Delete room
            </ContextMenuItem>
          </ContextMenuContent>
        ) : null}
      </ContextMenu>
      {participants && participants.length > 0 ? (
        <div className={s.participants}>
          {participants.map((p) => (
            <div key={p.identity} className={s.participant}>
              <Avatar className={s.participantAvatar}>
                <AvatarFallback className={s.participantFallback}>
                  {getInitials(p.name)}
                </AvatarFallback>
              </Avatar>
              <span className={s.participantName}>{p.name}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
