import type { MessageBubbleProps } from '../MessageBubble/MessageBubble.types';
import type { MessageMetaProps } from '../MessageMeta/MessageMeta.types';

export type MessageColumnProps = Omit<MessageBubbleProps, 'onEdit' | 'onDelete'> &
  Pick<MessageMetaProps, 'author' | 'identity' | 'verified'> & {
    isDeleted: boolean;
    showHeader: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onRetry: () => void;
    onDiscard: () => void;
  };
