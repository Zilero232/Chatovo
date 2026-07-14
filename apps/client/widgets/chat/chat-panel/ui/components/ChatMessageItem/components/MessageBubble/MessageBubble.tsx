'use client';

import { isImageMime } from '@chatovo/schemas';
import { clsx } from 'clsx';

import { MessageAttachment } from '../MessageAttachment';
import { MessageContent } from '../MessageContent';
import { MessageContextMenu } from '../MessageContextMenu';

import s from './MessageBubble.module.scss';

import type { MessageBubbleProps } from './MessageBubble.types';

export const MessageBubble = ({
  message,
  attachment,
  isOwn,
  isTail,
  isEdited,
  canEdit,
  showActions,
  onEdit,
  onDelete,
}: MessageBubbleProps) => {
  const isBareImage = attachment ? isImageMime(attachment.mime) : false;

  return (
    <MessageContextMenu enabled={showActions} canEdit={canEdit} onEdit={onEdit} onDelete={onDelete}>
      <div
        className={clsx(
          s.bubble,
          isOwn ? s.own : s.other,
          isBareImage ? s.bare : clsx(s.padded, isOwn ? s.ownPadded : s.otherPadded),
          isTail && (isOwn ? s.ownTail : s.otherTail),
        )}
      >
        {attachment ? (
          <MessageAttachment attachment={attachment} isOwn={isOwn} />
        ) : (
          <MessageContent message={message.message} isOwn={isOwn} isEdited={isEdited} />
        )}
      </div>
    </MessageContextMenu>
  );
};
