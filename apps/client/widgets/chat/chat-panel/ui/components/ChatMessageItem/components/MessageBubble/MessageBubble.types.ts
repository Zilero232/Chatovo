import type { ChatAttachment } from '@chatovo/schemas';
import type { ChatLine } from '../../../../../model/types';

export type MessageBubbleProps = {
  message: ChatLine;
  attachment: ChatAttachment | null;
  isOwn: boolean;
  isTail: boolean;
  isEdited: boolean;
  canEdit: boolean;
  showActions: boolean;
  onEdit: () => void;
  onDelete: () => void;
};
