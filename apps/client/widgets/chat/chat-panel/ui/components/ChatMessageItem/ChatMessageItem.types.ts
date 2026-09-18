import type { ChatLine } from '../../../model/types';

export type ChatMessageItemProps = {
  avatarUrl?: string | null;
  canManage: boolean;
  canPin?: boolean;
  canReact?: boolean;
  currentUserId: string;
  isGrouped: boolean;
  isOwn: boolean;
  isTail: boolean;
  message: ChatLine;
  repliedTo?: ChatLine | null;
  roleColor?: string | null;
  onDelete: (id: string) => void;
  onDiscard: (id: string) => void;
  onEdit: (id: string, body: string) => void;
  onPin?: (id: string, pinned: boolean) => void;
  onReply?: (id: string) => void;
  onRetry: (id: string, body: string) => void;
  onToggleReaction?: (id: string, emoji: string, hasReacted: boolean) => void;
};
