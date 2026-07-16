'use client';

import { MessageActions } from '../MessageActions';
import { MessageBody } from '../MessageBody';
import { MessageBubble } from '../MessageBubble';
import { MessageMeta } from '../MessageMeta';
import { MessageStatus } from '../MessageStatus';

import s from '../../ChatMessageItem.module.scss';

import type { MessageColumnProps } from './MessageColumn.types';

export const MessageColumn = ({
  message,
  attachment,
  author,
  identity,
  verified,
  isOwn,
  isTail,
  isDeleted,
  isEdited,
  canEdit,
  showHeader,
  showActions,
  onEdit,
  onDelete,
  onRetry,
  onDiscard,
}: MessageColumnProps) => (
  <div className={s.column} data-own={isOwn}>
    {showHeader && (
      <MessageMeta
        author={author}
        identity={identity}
        timestamp={message.timestamp}
        verified={verified}
        isOwn={isOwn}
      />
    )}

    <div className={s.bodyRow} data-own={isOwn}>
      <MessageBody
        bubble={
          <MessageBubble
            message={message}
            attachment={attachment}
            isOwn={isOwn}
            isTail={isTail}
            isEdited={isEdited}
            canEdit={canEdit}
            showActions={showActions}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        }
        isDeleted={isDeleted}
      />

      {showActions && <MessageActions canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} />}
    </div>

    {message.status && (
      <MessageStatus status={message.status} onRetry={onRetry} onDiscard={onDiscard} />
    )}
  </div>
);
