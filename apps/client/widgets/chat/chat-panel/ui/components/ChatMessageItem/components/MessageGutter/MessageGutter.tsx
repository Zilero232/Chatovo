'use client';

import { UserAvatar } from '@/entities/auth/user';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { formatMessageTime } from '@/shared/lib/format-date';
import { FriendProfileActionsPanel } from '@/widgets/social/friend-profile-actions-panel';

import { useChatMessage } from '../../../../../model/contexts';

import s from '../../ChatMessageItem.module.scss';

export const MessageGutter = () => {
  const { author, identity, avatarUrl, isGrouped, message } = useChatMessage();

  if (isGrouped) {
    return (
      <div className={s.gutter}>
        <span className={s.hoverTime}>{formatMessageTime(message.timestamp)}</span>
      </div>
    );
  }

  return (
    <div className={s.gutter}>
      <ProfileCardTrigger
        identity={identity}
        name={author}
        renderFriendActions={(state) => <FriendProfileActionsPanel {...state} />}
      >
        <UserAvatar className={s.avatar} name={author} src={avatarUrl} />
      </ProfileCardTrigger>
    </div>
  );
};
