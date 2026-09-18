import type { ChatReaction } from '@chatovo/schemas';

export type ChatLineStatus = 'failed' | 'sending';

export type ChatLine = {
  deletedAt?: number | null;
  editedAt?: number | null;
  from?: {
    identity: string;
    name?: string;
    metadata?: string;
  };
  id: string;
  mentions?: string[];
  mentionsEveryone?: boolean;
  message: string;
  pinned?: boolean;
  reactions?: ChatReaction[];
  replyToId?: string | null;
  status?: ChatLineStatus;
  threadId?: string | null;
  timestamp: number;
};
