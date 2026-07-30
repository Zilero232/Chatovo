'use client';

import type { ChatMessageItemProps } from './ChatMessageItem.types';

import { useChatMessageItem } from '../../../model/hooks';
import { MessageColumn, MessageDialogs } from './components';

import s from './ChatMessageItem.module.scss';

export const ChatMessageItem = ({
  message,
  isOwn,
  isGrouped,
  isTail,
  canManage,
  onEdit,
  onDelete,
  onRetry,
  onDiscard
}: ChatMessageItemProps) => {
  const {
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
    showHeader,
    showActions,
    startEdit
  } = useChatMessageItem({ message, isOwn, isGrouped, canManage });

  return (
    <div
      data-message-root
      className={s.root}
      data-own={isOwn}
      data-pending={message.status === 'sending'}
    >
      <MessageColumn
        attachment={attachment}
        author={author}
        canEdit={canEdit}
        identity={identity}
        isDeleted={isDeleted}
        isEdited={isEdited}
        isOwn={isOwn}
        isTail={isTail}
        message={message}
        showActions={showActions}
        showHeader={showHeader}
        verified={verified}
        onDelete={() => setIsConfirmingDelete(true)}
        onDiscard={() => onDiscard(message.id)}
        onEdit={startEdit}
        onRetry={() => onRetry(message.id, message.message)}
      />

      <MessageDialogs
        body={message.message}
        isConfirmingDelete={isConfirmingDelete}
        isEditing={isEditing}
        onConfirmDelete={() => {
          onDelete(message.id);
          setIsConfirmingDelete(false);
        }}
        onConfirmingDeleteChange={setIsConfirmingDelete}
        onEditingChange={setIsEditing}
        onSave={(body) => onEdit(message.id, body)}
      />
    </div>
  );
};
