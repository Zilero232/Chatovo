'use client';

import { isImageMime } from '@chatovo/schemas';
import dynamic from 'next/dynamic';

import { MessageAttachment } from '../MessageAttachment';
import { MessageContextMenu } from '../MessageContextMenu';
import { bubbleVariants } from './MessageBubble.variants';

const MessageContent = dynamic(
  () => import('../MessageContent').then((m) => ({ default: m.MessageContent })),
  { ssr: false },
);

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
        className={bubbleVariants({
          owner: isOwn ? 'own' : 'other',
          display: isBareImage ? 'bare' : 'padded',
          tail: isTail,
        })}
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
