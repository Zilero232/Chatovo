'use client';

import { Crown, Headphones, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isEmpty } from 'remeda';
import { UserAvatar, UserName, useCurrentUser } from '@/entities/auth/user';
import { MicMutedBadge, OwnerCrown, useRoomParticipants } from '@/entities/room/room';
import { ManageRoomMenu } from '@/features/room/manage';
import { buildRoomHref } from '@/shared/constants';
import { channelsRoomItemStyles as s } from './ChannelsRoomItem.styles';
import type { ChannelsRoomItemProps } from './ChannelsRoomItem.types';

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
        <button className={s.trigger({ active: isActive })} type="button" onClick={handleClick}>
          <span className={s.triggerLabel}>
            {room.name}
            {room.isPrivate && <Lock className={s.privateIcon} />}
            {isOwner && <Crown className={s.ownerIcon} />}
          </span>
          {isActive && <Headphones className={s.joinedIcon} />}
          {!isActive && !isEmpty(participants) && (
            <span className={s.count}>
              <span className={s.countDot} />
              {participants.length}
            </span>
          )}
        </button>
        <ManageRoomMenu className={s.manageSlot} room={room} />
      </div>
      {!isEmpty(participants) && (
        <div className={s.participants}>
          {participants.map((p) => (
            <div key={p.identity} className={s.participant}>
              <div className={s.participantAvatarWrapper}>
                {p.identity === room.ownerId && <OwnerCrown />}
                {p.micMuted && <MicMutedBadge />}
                <UserAvatar
                  name={p.name}
                  src={p.avatarUrl}
                  className={s.participantAvatar}
                  fallbackClassName={s.participantFallback}
                />
              </div>
              <UserName
                name={p.name}
                verified={p.verified}
                profileUrl={p.profileUrl}
                className={s.participantName}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
