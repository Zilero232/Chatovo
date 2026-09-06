'use client';

import { clsx } from 'clsx';
import { Crown, Gamepad2, Headphones, Lock } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
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
import { buildRoomHref } from '@/shared/lib';
import { AvatarWithBadges } from '@/ui-kit';
import { FriendProfileActionsPanel } from '@/widgets/social/friend-profile-actions-panel';

import type { ChannelsRoomItemProps } from './ChannelsRoomItem.types';

import {
  PARTICIPANTS_ANIMATE,
  PARTICIPANTS_EXIT,
  PARTICIPANTS_INITIAL,
  PARTICIPANTS_TRANSITION
} from './ChannelsRoomItem.motion';

import s from './ChannelsRoomItem.module.scss';

export const ChannelsRoomItem = ({ room, onNavigate }: ChannelsRoomItemProps) => {
  const t = useTranslations('channels');
  const router = useRouter();
  const params = useSearchParams();

  const { user } = useCurrentUser();

  const activeRoomId = params.get('id');
  const isActive = activeRoomId === room.id;
  const isOwner = user?.id === room.ownerId;

  const participants = useRoomParticipants(room.id);
  const hasParticipants = !isEmpty(participants);

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
            {room.isPrivate && (
              <>
                <Lock aria-hidden className={s.privateIcon} />
                <span className='sr-only'>{t('privateRoom')}</span>
              </>
            )}
            {isOwner && <Crown aria-hidden className={s.ownerIcon} />}
          </span>
          {isActive && <Headphones aria-hidden className={s.joinedIcon} />}
        </button>
        <ManageRoomMenu className={s.manageSlot} room={room} />
      </div>

      <AnimatePresence initial={false}>
        {hasParticipants && (
          <motion.div
            animate={PARTICIPANTS_ANIMATE}
            className={s.participantsWrap}
            exit={PARTICIPANTS_EXIT}
            initial={PARTICIPANTS_INITIAL}
            transition={PARTICIPANTS_TRANSITION}
          >
            <div className={s.participants}>
              {participants.map((p) => (
                <ProfileCardTrigger
                  key={p.identity}
                  className={s.participant}
                  identity={p.identity}
                  name={p.name}
                  renderFriendActions={(state) => <FriendProfileActionsPanel {...state} />}
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
                  <span className={s.participantMeta}>
                    <UserName
                      className={s.participantName}
                      developer={p.developer}
                      name={p.name}
                      verified={p.verified}
                    />
                    {p.activity && (
                      <span className={s.participantActivity}>
                        <Gamepad2 aria-hidden className={s.participantActivityIcon} />
                        <span className={s.participantActivityLabel}>{p.activity}</span>
                      </span>
                    )}
                  </span>
                </ProfileCardTrigger>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
