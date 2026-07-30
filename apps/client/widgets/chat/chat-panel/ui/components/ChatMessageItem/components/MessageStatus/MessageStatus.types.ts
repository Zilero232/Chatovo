import type { ChatLineStatus } from '../../../../../model/types';

export type MessageStatusProps = {
  status: ChatLineStatus;
  onDiscard: () => void;
  onRetry: () => void;
};
