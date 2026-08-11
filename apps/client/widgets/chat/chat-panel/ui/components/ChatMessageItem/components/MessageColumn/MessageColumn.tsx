'use client';

import { useChatMessage } from '../../../../../model/contexts';
import { MessageActions } from '../MessageActions';
import { MessageBody } from '../MessageBody';
import { MessageBubble } from '../MessageBubble';
import { MessageMeta } from '../MessageMeta';
import { MessageStatus } from '../MessageStatus';

import s from '../../ChatMessageItem.module.scss';

export const MessageColumn = () => {
  const { message, isOwn, isDeleted, showHeader, showActions } = useChatMessage();

  return (
    <div className={s.column} data-own={isOwn}>
      {showHeader && <MessageMeta />}

      <div className={s.bodyRow} data-own={isOwn}>
        <MessageBody bubble={<MessageBubble />} isDeleted={isDeleted} />

        {showActions && <MessageActions />}
      </div>

      {message.status && <MessageStatus status={message.status} />}
    </div>
  );
};
