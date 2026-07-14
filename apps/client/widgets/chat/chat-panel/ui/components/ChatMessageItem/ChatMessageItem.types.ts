import type { ChatLine } from '../../../model/types';

export type ChatMessageItemProps = {
  message: ChatLine;
  isOwn: boolean;
  isGrouped: boolean;
  isTail: boolean;
  canManage: boolean;
  onEdit: (id: string, body: string) => void;
  onDelete: (id: string) => void;
  onRetry: (id: string, body: string) => void;
  onDiscard: (id: string) => void;
};
