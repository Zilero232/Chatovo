import type { ChatAttachment } from '@chatovo/schemas';

import type { ChatLine } from '../../../../../model/types';

export type MessageBubbleProps = {
  attachment: ChatAttachment | null;
  canEdit: boolean;
  isEdited: boolean;
  isOwn: boolean;
  isTail: boolean;
  message: ChatLine;
  showActions: boolean;
  onDelete: () => void;
  onEdit: () => void;
};
