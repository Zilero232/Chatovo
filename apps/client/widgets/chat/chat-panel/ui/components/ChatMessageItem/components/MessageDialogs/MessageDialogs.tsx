'use client';

import type { MessageDialogsProps } from './MessageDialogs.types';

import { DeleteMessageDialog } from '../DeleteMessageDialog';
import { EditMessageDialog } from '../EditMessageDialog';

export const MessageDialogs = ({
  body,
  isEditing,
  isConfirmingDelete,
  onEditingChange,
  onConfirmingDeleteChange,
  onSave,
  onConfirmDelete
}: MessageDialogsProps) => (
  <>
    <EditMessageDialog
      key={body}
      initialValue={body}
      open={isEditing}
      onOpenChange={onEditingChange}
      onSave={onSave}
    />

    <DeleteMessageDialog
      open={isConfirmingDelete}
      onConfirm={onConfirmDelete}
      onOpenChange={onConfirmingDeleteChange}
    />
  </>
);
