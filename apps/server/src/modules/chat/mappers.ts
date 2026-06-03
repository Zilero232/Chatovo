import { resolveDisplayName } from '../users/profile';
import type { ChatMessage } from '@chatovo/schemas';
import type { Prisma } from '../../../generated';
import type { senderSelect } from '../../lib';

export type MessageWithSender = Prisma.MessageGetPayload<{
  include: { sender: typeof senderSelect };
}>;

export const toChatMessage = (row: MessageWithSender): ChatMessage => {
  const { id, roomId, senderId, sender, body, createdAt } = row;

  return {
    id,
    roomId,
    senderId,
    senderName:
      sender && senderId
        ? resolveDisplayName({
            displayName: sender.profile?.displayName,
            name: sender.name,
            email: sender.email,
            userId: senderId,
          })
        : 'Deleted user',
    body,
    createdAt: createdAt.toISOString(),
  };
};
