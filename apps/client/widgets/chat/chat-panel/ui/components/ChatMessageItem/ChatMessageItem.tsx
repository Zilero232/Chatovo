'use client';

import { useChatMessageItem } from '../../../model/hooks';
import { MessageColumn, MessageDialogs } from './components';

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
    startEdit,
  } = useChatMessageItem({ message, isOwn, isGrouped, canManage });

  return (
    <div
      className={s.root}
      data-own={isOwn}
      data-pending={message.status === 'sending'}
      data-message-root
    >
      <MessageColumn
        message={message}
        attachment={attachment}
        author={author}
        identity={identity}
        verified={verified}
        isOwn={isOwn}
        isTail={isTail}
        isDeleted={isDeleted}
        isEdited={isEdited}
        canEdit={canEdit}
        showHeader={showHeader}
        showActions={showActions}
        onEdit={startEdit}
        onDelete={() => setIsConfirmingDelete(true)}
        onRetry={() => onRetry(message.id, message.message)}
        onDiscard={() => onDiscard(message.id)}
      />

      <MessageDialogs
        body={message.message}
        isEditing={isEditing}
        isConfirmingDelete={isConfirmingDelete}
        onEditingChange={setIsEditing}
        onConfirmingDeleteChange={setIsConfirmingDelete}
        onSave={(body) => onEdit(message.id, body)}
        onConfirmDelete={() => {
          onDelete(message.id);
          setIsConfirmingDelete(false);
        }}
      />
    </div>
  );
};
