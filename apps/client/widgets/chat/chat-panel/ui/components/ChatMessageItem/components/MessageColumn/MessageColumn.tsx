'use client';

import { useChatMessage } from '../../../../../model/contexts';
import { MessageActions } from '../MessageActions/MessageActions';
import { MessageBody } from '../MessageBody/MessageBody';
import { MessageBubble } from '../MessageBubble/MessageBubble';
import { MessageMeta } from '../MessageMeta/MessageMeta';
import { MessageReactions } from '../MessageReactions/MessageReactions';
import { MessageReplyPreview } from '../MessageReplyPreview/MessageReplyPreview';
import { MessageStatus } from '../MessageStatus/MessageStatus';

import s from '../../ChatMessageItem.module.scss';

export const MessageColumn = () => {
  const { message, isDeleted, showHeader } = useChatMessage();

  return (
    <div className={s.column}>
      <MessageReplyPreview />

      {showHeader && <MessageMeta />}

      <div className={s.bodyRow}>
        <MessageBody bubble={<MessageBubble />} isDeleted={isDeleted} />
      </div>

      {!isDeleted && <MessageReactions />}

      {message.status && <MessageStatus status={message.status} />}

      <MessageActions />
    </div>
  );
};
