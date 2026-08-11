'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { ChevronDown, Crown, Headphones, Lock } from 'lucide-react';
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
import { buildRoomHref } from '@/shared/constants';
import { useLiteMotion } from '@/shared/hooks';
import { AvatarWithBadges, Badge } from '@/shared/ui';
import { FriendProfileActionsPanel } from '@/widgets/social/friend-profile-actions-panel';

import type { ChannelsRoomItemProps } from './ChannelsRoomItem.types';

import {
  PARTICIPANTS_ANIMATE,
  PARTICIPANTS_EXIT,
  PARTICIPANTS_INITIAL,
  PARTICIPANTS_TRANSITION
} from './ChannelsRoomItem.motion';

import s from './ChannelsRoomItem.module.scss';

const MAX_STACK_AVATARS = 5;

export const ChannelsRoomItem = ({ room, onNavigate }: ChannelsRoomItemProps) => {
  const t = useTranslations('channels');
  const router = useRouter();
  const params = useSearchParams();

  const { user } = useCurrentUser();
  const { resolveTransition } = useLiteMotion();

  const activeRoomId = params.get('id');
  const isActive = activeRoomId === room.id;
  const isOwner = user?.id === room.ownerId;

  const participants = useRoomParticipants(room.id);
  const hasParticipants = !isEmpty(participants);

  const [isManuallyExpanded, toggleExpanded] = useBoolean(false);
  const isExpanded = isActive || isManuallyExpanded;

  const stacked = participants.slice(0, MAX_STACK_AVATARS);
  const overflow = participants.length - stacked.length;

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

      {hasParticipants && !isExpanded && (
        <button
          aria-expanded={false}
          aria-label={t('showParticipants')}
          className={s.stack}
          type='button'
          onClick={() => toggleExpanded(true)}
        >
          <span className={s.stackAvatars}>
            {stacked.map((participant) => (
              <AvatarWithBadges
                key={participant.identity}
                className={s.stackAvatarSlot}
                topLeft={participant.identity === room.ownerId && <OwnerCrown />}
              >
                <UserAvatar
                  className={s.stackAvatar}
                  fallbackClassName={s.stackAvatarFallback}
                  name={participant.name}
                  src={participant.avatarUrl}
                />
              </AvatarWithBadges>
            ))}
            {overflow > 0 && (
              <Badge size='sm' tone='muted'>
                +{overflow}
              </Badge>
            )}
          </span>
          <ChevronDown aria-hidden className={s.stackChevron} />
        </button>
      )}

      <AnimatePresence initial={false}>
        {hasParticipants && isExpanded && (
          <motion.div
            animate={PARTICIPANTS_ANIMATE}
            className={s.participantsWrap}
            exit={PARTICIPANTS_EXIT}
            initial={PARTICIPANTS_INITIAL}
            transition={resolveTransition(PARTICIPANTS_TRANSITION)}
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
                  <UserName className={s.participantName} name={p.name} verified={p.verified} />
                </ProfileCardTrigger>
              ))}
            </div>

            {!isActive && (
              <button
                aria-expanded
                className={s.collapse}
                type='button'
                onClick={() => toggleExpanded(false)}
              >
                {t('hideParticipants')}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
