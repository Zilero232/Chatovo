'use client';

import { clsx } from 'clsx';
import { Crown, Headphones, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isEmpty } from 'remeda';

import { useCurrentUser, UserAvatar, UserName } from '@/entities/auth/user';
import {
  DeafenedBadge,
  MicMutedBadge,
  OwnerCrown,
  useRoomParticipants
} from '@/entities/room/room';
import { ManageRoomMenu } from '@/features/room/manage';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { buildRoomHref } from '@/shared/constants';
import { AvatarWithBadges } from '@/shared/ui';

import type { ChannelsRoomItemProps } from './ChannelsRoomItem.types';

import s from './ChannelsRoomItem.module.scss';

export const ChannelsRoomItem = ({ room, onNavigate }: ChannelsRoomItemProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const { user } = useCurrentUser();

  const activeRoomId = params.get('id');
  const isActive = activeRoomId === room.id;
  const isOwner = user?.id === room.ownerId;

  const participants = useRoomParticipants(room.id);

  const handleClick = () => {
    router.push(buildRoomHref(room.id));
    onNavigate?.();
  };

  return (
    <div>
      <div className={s.row}>
        <button
          className={clsx(s.trigger, {
            [s.triggerActive]: isActive,
            [s.triggerOwner]: isOwner
          })}
          type='button'
          onClick={handleClick}
        >
          <span className={s.triggerLabel}>
            {room.name}
            {room.isPrivate && <Lock className={s.privateIcon} />}
            {isOwner && <Crown className={s.ownerIcon} />}
          </span>
          {isActive && <Headphones className={s.joinedIcon} />}
        </button>
        <ManageRoomMenu className={s.manageSlot} room={room} />
      </div>
      {!isEmpty(participants) && (
        <div className={s.participants}>
          {participants.map((p) => (
            <ProfileCardTrigger
              key={p.identity}
              className={s.participant}
              identity={p.identity}
              name={p.name}
            >
              <AvatarWithBadges
                bottomLeft={p.deafened && <DeafenedBadge />}
                bottomRight={p.micMuted && <MicMutedBadge />}
                topLeft={p.identity === room.ownerId && <OwnerCrown />}
              >
                <UserAvatar
                  className={s.participantAvatar}
                  fallbackClassName={s.participantFallback}
                  name={p.name}
                  src={p.avatarUrl}
                />
              </AvatarWithBadges>
              <UserName className={s.participantName} name={p.name} verified={p.verified} />
            </ProfileCardTrigger>
          ))}
        </div>
      )}
    </div>
  );
};
