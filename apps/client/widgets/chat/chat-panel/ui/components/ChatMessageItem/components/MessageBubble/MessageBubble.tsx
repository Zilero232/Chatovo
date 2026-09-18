'use client';

import { isImageMime } from '@chatovo/schemas';
import dynamic from 'next/dynamic';

import { useChatMessage } from '../../../../../model/contexts';
import { MessageAttachment } from '../MessageAttachment/MessageAttachment';
import { MessageContextMenu } from '../MessageContextMenu/MessageContextMenu';
import { bubbleVariants } from './MessageBubble.variants';

const MessageContent = dynamic(
  () => import('../MessageContent/MessageContent').then((m) => ({ default: m.MessageContent })),
  { ssr: false }
);

export const MessageBubble = () => {
  const { attachment } = useChatMessage();

  const isBareImage = attachment ? isImageMime(attachment.mime) : false;

  return (
    <MessageContextMenu>
      <div className={bubbleVariants({ display: isBareImage ? 'bare' : 'padded' })}>
        {attachment ? <MessageAttachment attachment={attachment} /> : <MessageContent />}
      </div>
    </MessageContextMenu>
  );
};
