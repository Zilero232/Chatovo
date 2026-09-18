'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';

import type { ChatLine } from '../types';

import { useChatMessageItem } from '../hooks';

type ChatMessageParams = {
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

const useChatMessageState = ({
  message,
  isOwn,
  isGrouped,
  isTail,
  canManage,
  canPin = false,
  canReact = false,
  currentUserId,
  avatarUrl = null,
  roleColor = null,
  repliedTo = null,
  onEdit,
  onDelete,
  onRetry,
  onDiscard,
  onPin,
  onReply,
  onToggleReaction
}: ChatMessageParams) => {
  const item = useChatMessageItem({ message, isOwn, isGrouped, canManage });

  const isUnsent = Boolean(message.status);

  return {
    ...item,
    message,
    isOwn,
    isGrouped,
    isTail,
    currentUserId,
    avatarUrl,
    roleColor,
    repliedTo,
    mentionsMe:
      !item.isDeleted &&
      Boolean(message.mentionsEveryone || (message.mentions ?? []).includes(currentUserId)),
    canPin: canPin && !item.isDeleted && !isUnsent,
    canReact: canReact && !item.isDeleted && !isUnsent,
    canReply: Boolean(onReply) && !item.isDeleted && !isUnsent,
    isPinned: message.pinned ?? false,
    requestDelete: () => item.setIsConfirmingDelete(true),
    confirmDelete: () => {
      onDelete(message.id);
      item.setIsConfirmingDelete(false);
    },
    saveEdit: (body: string) => onEdit(message.id, body),
    retry: () => onRetry(message.id, message.message),
    discard: () => onDiscard(message.id),
    togglePin: () => onPin?.(message.id, !(message.pinned ?? false)),
    reply: () => onReply?.(message.id),
    hasReactedWith: (emoji: string) =>
      Boolean(
        (message.reactions ?? [])
          .find((reaction) => reaction.emoji === emoji)
          ?.userIds.includes(currentUserId)
      ),
    toggleReaction: (emoji: string, hasReacted: boolean) =>
      onToggleReaction?.(message.id, emoji, hasReacted)
  };
};

const { Provider, use } = createContextHook(useChatMessageState);

export const ChatMessageProvider = ({
  children,
  ...params
}: ChatMessageParams & { children: ReactNode }) => (
  <Provider params={[params]}>{children}</Provider>
);

export const useChatMessage = () => {
  const value = use();

  if (!value) {
    throw new Error('useChatMessage must be used within ChatMessageProvider');
  }

  return value;
};
