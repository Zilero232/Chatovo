import type { ChatMessage, ChatReaction } from '@chatovo/schemas';

import { parseMentions } from '@chatovo/schemas';

import type { Prisma } from '../../../generated';

import { senderSelect } from '../../lib';
import { resolveDisplayName } from '../users';

export const messageInclude = {
  sender: senderSelect,
  reactions: { select: { emoji: true, userId: true } }
} satisfies Prisma.MessageInclude;

export type MessageWithSender = Prisma.MessageGetPayload<{ include: typeof messageInclude }>;

export const groupReactions = (rows: { emoji: string; userId: string }[]): ChatReaction[] => {
  const byEmoji = new Map<string, string[]>();

  rows.forEach(({ emoji, userId }) => {
    byEmoji.set(emoji, [...(byEmoji.get(emoji) ?? []), userId]);
  });

  return [...byEmoji.entries()].map(([emoji, userIds]) => ({
    emoji,
    count: userIds.length,
    userIds
  }));
};

export const toChatMessage = (row: MessageWithSender): ChatMessage => {
  const {
    id,
    roomId,
    threadId,
    replyToId,
    pinned,
    senderId,
    sender,
    reactions,
    body,
    createdAt,
    editedAt,
    deletedAt
  } = row;

  const mentions = deletedAt ? { userIds: [], everyone: false } : parseMentions(body);

  return {
    id,
    roomId,
    threadId,
    replyToId,
    pinned,
    reactions: groupReactions(reactions),
    mentions: mentions.userIds,
    mentionsEveryone: mentions.everyone,
    senderId,
    senderName:
      sender && senderId
        ? resolveDisplayName({
            displayName: sender.profile?.displayName,
            name: sender.name,
            userId: senderId
          })
        : 'Deleted user',
    body: deletedAt ? '' : body,
    createdAt: createdAt.toISOString(),
    editedAt: editedAt?.toISOString() ?? null,
    deletedAt: deletedAt?.toISOString() ?? null
  };
};
