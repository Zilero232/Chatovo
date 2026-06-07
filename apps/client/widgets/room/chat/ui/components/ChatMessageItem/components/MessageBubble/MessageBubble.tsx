'use client';

import { isImageMime } from '@chatovo/schemas';
import { MessageAttachment } from '../MessageAttachment';
import { MessageContent } from '../MessageContent';
import { MessageContextMenu } from '../MessageContextMenu';
import { messageBubbleStyles as s } from './MessageBubble.styles';
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
      <div className={s({ own: isOwn, bare: isBareImage, tail: isTail })}>
        {attachment ? (
          <MessageAttachment attachment={attachment} isOwn={isOwn} />
        ) : (
          <MessageContent message={message.message} isOwn={isOwn} isEdited={isEdited} />
        )}
      </div>
    </MessageContextMenu>
  );
};
