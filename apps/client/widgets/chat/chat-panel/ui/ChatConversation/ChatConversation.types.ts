export type ChatConversationProps = {
  canModerate?: boolean;
  canSend?: boolean;
  channelName?: string | null;
  currentUserId: string;
  enabled?: boolean;
  roomId: string;
  serverId?: string | null;
  threadId?: string | null;
  onTyping?: () => void;
};
