import type { ChatMessage } from '@chatovo/schemas';

import type { ChatLine } from '../types';

export const chatMessageToChatLine = ({
  id,
  createdAt,
  body,
  senderId,
  senderName,
  editedAt,
  deletedAt,
  pinned,
  threadId,
  replyToId,
  reactions,
  mentions,
  mentionsEveryone
}: ChatMessage): ChatLine => ({
  id,
  timestamp: new Date(createdAt).getTime(),
  message: body,
  pinned,
  threadId,
  replyToId,
  reactions,
  mentions,
  mentionsEveryone,
  editedAt: editedAt ? new Date(editedAt).getTime() : null,
  deletedAt: deletedAt ? new Date(deletedAt).getTime() : null,
  from: {
    identity: senderId ?? `deleted:${id}`,
    name: senderName
  }
});
