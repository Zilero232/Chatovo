'use client';

import type { MessageColumnProps } from './MessageColumn.types';

import { MessageActions } from '../MessageActions';
import { MessageBody } from '../MessageBody';
import { MessageBubble } from '../MessageBubble';
import { MessageMeta } from '../MessageMeta';
import { MessageStatus } from '../MessageStatus';

import s from '../../ChatMessageItem.module.scss';

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
  onDiscard
}: MessageColumnProps) => (
  <div className={s.column} data-own={isOwn}>
    {showHeader && (
      <MessageMeta
        author={author}
        identity={identity}
        isOwn={isOwn}
        timestamp={message.timestamp}
        verified={verified}
      />
    )}

    <div className={s.bodyRow} data-own={isOwn}>
      <MessageBody
        bubble={
          <MessageBubble
            attachment={attachment}
            canEdit={canEdit}
            isEdited={isEdited}
            isOwn={isOwn}
            isTail={isTail}
            message={message}
            showActions={showActions}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        }
        isDeleted={isDeleted}
      />

      {showActions && <MessageActions canEdit={canEdit} onDelete={onDelete} onEdit={onEdit} />}
    </div>

    {message.status && (
      <MessageStatus status={message.status} onDiscard={onDiscard} onRetry={onRetry} />
    )}
  </div>
);
