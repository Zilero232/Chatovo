'use client';

import { isImageMime } from '@chatovo/schemas';
import dynamic from 'next/dynamic';

import type { MessageBubbleProps } from './MessageBubble.types';

import { MessageAttachment } from '../MessageAttachment';
import { MessageContextMenu } from '../MessageContextMenu';
import { bubbleVariants } from './MessageBubble.variants';

const MessageContent = dynamic(
  () => import('../MessageContent').then((m) => ({ default: m.MessageContent })),
  { ssr: false }
);

export const MessageBubble = ({
  message,
  attachment,
  isOwn,
  isTail,
  isEdited,
  canEdit,
  showActions,
  onEdit,
  onDelete
}: MessageBubbleProps) => {
  const isBareImage = attachment ? isImageMime(attachment.mime) : false;

  return (
    <MessageContextMenu canEdit={canEdit} enabled={showActions} onDelete={onDelete} onEdit={onEdit}>
      <div
        className={bubbleVariants({
          owner: isOwn ? 'own' : 'other',
          display: isBareImage ? 'bare' : 'padded',
          tail: isTail
        })}
      >
        {attachment ? (
          <MessageAttachment attachment={attachment} isOwn={isOwn} />
        ) : (
          <MessageContent isEdited={isEdited} isOwn={isOwn} message={message.message} />
        )}
      </div>
    </MessageContextMenu>
  );
};
