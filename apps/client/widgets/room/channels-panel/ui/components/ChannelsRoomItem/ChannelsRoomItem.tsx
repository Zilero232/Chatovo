'use client';

import { Crown, Headphones, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isEmpty } from 'remeda';
import { UserAvatar, UserName, useCurrentUser } from '@/entities/auth/user';
import { MicMutedBadge, OwnerCrown, useRoomParticipants } from '@/entities/room/room';
import { ManageRoomMenu } from '@/features/room/manage';
import { buildRoomHref } from '@/shared/constants';
import { AvatarWithBadges } from '@/shared/ui';
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
        </button>
        <ManageRoomMenu className={s.manageSlot} room={room} />
      </div>
      {!isEmpty(participants) && (
        <div className={s.participants}>
          {participants.map((p) => (
            <div key={p.identity} className={s.participant}>
              <AvatarWithBadges
                topLeft={p.identity === room.ownerId ? <OwnerCrown /> : null}
                bottomRight={p.micMuted ? <MicMutedBadge /> : null}
              >
                <UserAvatar
                  name={p.name}
                  src={p.avatarUrl}
                  className={s.participantAvatar}
                  fallbackClassName={s.participantFallback}
                />
              </AvatarWithBadges>
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
