'use client';

import { decodeChatAttachment } from '@chatovo/schemas';
import { useState } from 'react';

import { readParticipantMeta } from '@/entities/room/room';
import {
  DeleteMessageDialog,
  EditMessageDialog,
  MessageActions,
  MessageBody,
  MessageBubble,
  MessageMeta,
  MessageStatus,
} from './components';

import s from './ChatMessageItem.module.scss';

import type { ChatMessageItemProps } from './ChatMessageItem.types';

export const ChatMessageItem = ({
  message,
  isOwn,
  isGrouped,
  isTail,
  canManage,
  onEdit,
  onDelete,
  onRetry,
  onDiscard,
}: ChatMessageItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const author = message.from?.name || message.from?.identity || 'Guest';
  const identity = message.from?.identity ?? author;

  const { verified } = readParticipantMeta(message.from?.metadata);

  const isDeleted = Boolean(message.deletedAt);
  const attachment = !isDeleted ? decodeChatAttachment(message.message) : null;

  const isUnsent = Boolean(message.status);
  const showHeader = !isGrouped;
  const isEdited = Boolean(message.editedAt) && !isDeleted;
  const canEdit = canManage && isOwn && !isDeleted && !attachment && !isUnsent;
  const showActions = canManage && isOwn && !isDeleted && !isEditing && !isUnsent;

  const startEdit = () => setIsEditing(true);

  return (
    <div
      className={s.root}
      data-own={isOwn}
      data-pending={message.status === 'sending'}
      data-message-root
    >
      <div className={s.column} data-own={isOwn}>
        {showHeader && (
          <MessageMeta
            author={author}
            identity={identity}
            timestamp={message.timestamp}
            verified={verified}
            isOwn={isOwn}
          />
        )}

        <div className={s.bodyRow} data-own={isOwn}>
          <MessageBody
            bubble={
              <MessageBubble
                message={message}
                attachment={attachment}
                isOwn={isOwn}
                isTail={isTail}
                isEdited={isEdited}
                canEdit={canEdit}
                showActions={showActions}
                onEdit={startEdit}
                onDelete={() => setIsConfirmingDelete(true)}
              />
            }
            isDeleted={isDeleted}
          />

          {showActions && (
            <MessageActions
              canEdit={canEdit}
              onEdit={startEdit}
              onDelete={() => setIsConfirmingDelete(true)}
            />
          )}
        </div>

        {message.status && (
          <MessageStatus
            status={message.status}
            onRetry={() => onRetry(message.id, message.message)}
            onDiscard={() => onDiscard(message.id)}
          />
        )}
      </div>

      <EditMessageDialog
        key={message.message}
        open={isEditing}
        initialValue={message.message}
        onOpenChange={setIsEditing}
        onSave={(body) => onEdit(message.id, body)}
      />

      <DeleteMessageDialog
        open={isConfirmingDelete}
        onOpenChange={setIsConfirmingDelete}
        onConfirm={() => {
          onDelete(message.id);
          setIsConfirmingDelete(false);
        }}
      />
    </div>
  );
};
