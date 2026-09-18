'use client';

import { useCurrentUser } from '@/entities/auth/user';
import { ChatConversation } from '@/widgets/chat/chat-panel';

import type { TextChannelBodyProps } from './TextChannelBody.types';

import { useTypingSender } from '../../../model/hooks';
import { TypingIndicator } from '../TypingIndicator/TypingIndicator';

import s from './TextChannelBody.module.scss';

export const TextChannelBody = ({
  channel,
  serverId,
  threadId,
  canSend,
  canModerate
}: TextChannelBodyProps) => {
  const { user } = useCurrentUser();

  const sendTyping = useTypingSender({ channelId: channel.id, threadId });

  if (!user) {
    return null;
  }

  return (
    <div className={s.root}>
      <ChatConversation
        key={`${channel.id}:${threadId ?? ''}`}
        canModerate={canModerate}
        canSend={canSend}
        channelName={channel.name}
        currentUserId={user.id}
        roomId={channel.id}
        serverId={serverId}
        threadId={threadId}
        onTyping={sendTyping}
      />
      <TypingIndicator channelId={channel.id} serverId={serverId} threadId={threadId} />
    </div>
  );
};
