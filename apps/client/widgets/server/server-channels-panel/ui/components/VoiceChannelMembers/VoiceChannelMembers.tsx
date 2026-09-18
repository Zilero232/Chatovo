'use client';

import { AnimatePresence, motion } from 'motion/react';
import { isEmpty } from 'remeda';

import { UserAvatar } from '@/entities/auth/user';
import { useRoomParticipants } from '@/entities/room/room';

import type { VoiceChannelMembersProps } from './VoiceChannelMembers.types';

import s from './VoiceChannelMembers.module.scss';

export const VoiceChannelMembers = ({ channelId }: VoiceChannelMembersProps) => {
  const participants = useRoomParticipants(channelId);

  return (
    <AnimatePresence initial={false}>
      {!isEmpty(participants) && (
        <motion.div
          animate={{ height: 'auto', opacity: 1 }}
          className={s.root}
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <ul className={s.list}>
            {participants.map((participant) => (
              <li key={participant.identity} className={s.item}>
                <UserAvatar
                  className={s.avatar}
                  name={participant.name}
                  size='sm'
                  src={participant.avatarUrl}
                />
                <span className={s.name}>{participant.name}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
