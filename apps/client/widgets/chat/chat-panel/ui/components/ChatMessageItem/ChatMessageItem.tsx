'use client';

import type { ChatMessageItemProps } from './ChatMessageItem.types';

import { ChatMessageProvider, useChatMessage } from '../../../model/contexts';
import { MessageColumn, MessageDialogs, MessageGutter } from './components';

import s from './ChatMessageItem.module.scss';

const ChatMessageItemBody = () => {
  const { message, isOwn, isGrouped, isTail, mentionsMe } = useChatMessage();

  return (
    <div
      data-message-root
      className={s.root}
      data-grouped={isGrouped}
      data-mentioned={mentionsMe}
      data-own={isOwn}
      data-pending={message.status === 'sending'}
      data-tail={isTail}
    >
      <MessageGutter />

      <MessageColumn />

      <MessageDialogs />
    </div>
  );
};

export const ChatMessageItem = (props: ChatMessageItemProps) => (
  <ChatMessageProvider {...props}>
    <ChatMessageItemBody />
  </ChatMessageProvider>
);
