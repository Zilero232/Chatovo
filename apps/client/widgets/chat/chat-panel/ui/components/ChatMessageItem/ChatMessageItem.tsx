'use client';

import { useChatMessageItem } from '../../../model/hooks';
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
