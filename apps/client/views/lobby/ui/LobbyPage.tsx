'use client';

import { useFriendChat } from '@/features/social/friend-chat';
import { FriendChatPanel } from '@/widgets/social/friend-chat-panel';
import { FriendsActivity } from '@/widgets/social/friends-activity';
import { FriendsPanel } from '@/widgets/social/friends-panel';

import s from './LobbyPage.module.scss';

export const LobbyPage = () => {
  const { session, openingPeer } = useFriendChat();

  const peer = session?.peer ?? openingPeer;

  return (
    <div className={s.root}>
      <div className={s.main}>{peer ? <FriendChatPanel peer={peer} /> : <FriendsPanel />}</div>

      <div className={s.aside}>
        <FriendsActivity />
      </div>
    </div>
  );
};
