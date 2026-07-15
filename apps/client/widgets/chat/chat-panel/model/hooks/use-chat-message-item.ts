'use client';

import { decodeChatAttachment } from '@chatovo/schemas';
import { useState } from 'react';

import { readParticipantMeta } from '@/entities/room/room';

import type { ChatLine } from '../types';

type UseChatMessageItemArgs = {
  message: ChatLine;
  isOwn: boolean;
  isGrouped: boolean;
  canManage: boolean;
};

export const useChatMessageItem = ({
  message,
  isOwn,
  isGrouped,
  canManage,
}: UseChatMessageItemArgs) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const author = message.from?.name || message.from?.identity || 'Guest';
  const identity = message.from?.identity ?? author;

  const { verified } = readParticipantMeta(message.from?.metadata);

  const isDeleted = Boolean(message.deletedAt);
  const attachment = !isDeleted ? decodeChatAttachment(message.message) : null;

  const isUnsent = Boolean(message.status);
  const isEdited = Boolean(message.editedAt) && !isDeleted;
  const canEdit = canManage && isOwn && !isDeleted && !attachment && !isUnsent;

  return {
    isEditing,
    setIsEditing,
    isConfirmingDelete,
    setIsConfirmingDelete,
    author,
    identity,
    verified,
    isDeleted,
    attachment,
    isEdited,
    canEdit,
    showHeader: !isGrouped,
    showActions: canManage && isOwn && !isDeleted && !isEditing && !isUnsent,
    startEdit: () => setIsEditing(true),
  };
};
