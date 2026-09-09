'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';

import {
  LIST_ITEM_ANIMATE,
  LIST_ITEM_EXIT,
  LIST_ITEM_INITIAL,
  LIST_ITEM_TRANSITION
} from '@/shared/config';

import type { FriendsGroupProps } from './FriendsGroup.types';

import { ChannelsFriendItem } from '../ChannelsFriendItem/ChannelsFriendItem';

import s from '../../ChannelsFriends.module.scss';

export const FriendsGroup = ({
  friends,
  labelKey,
  roomByUserId,
  onNavigate
}: FriendsGroupProps) => {
  const t = useTranslations('channels.friends');

  if (isEmpty(friends)) {
    return null;
  }

  return (
    <div className={s.group}>
      <p className={s.sectionLabel}>{t(labelKey, { count: friends.length })}</p>

      <AnimatePresence initial={false} mode='popLayout'>
        {friends.map((entry) => (
          <motion.div
            key={entry.friendshipId}
            animate={LIST_ITEM_ANIMATE}
            exit={LIST_ITEM_EXIT}
            initial={LIST_ITEM_INITIAL}
            layout='position'
            transition={LIST_ITEM_TRANSITION}
          >
            <ChannelsFriendItem
              room={roomByUserId.get(entry.user.id)}
              user={entry.user}
              onNavigate={onNavigate}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
