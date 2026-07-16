'use client';

import { DeleteMessageDialog } from '../DeleteMessageDialog';
import { EditMessageDialog } from '../EditMessageDialog';

import type { MessageDialogsProps } from './MessageDialogs.types';

export const MessageDialogs = ({
  body,
  isEditing,
  isConfirmingDelete,
  onEditingChange,
  onConfirmingDeleteChange,
  onSave,
  onConfirmDelete,
}: MessageDialogsProps) => (
  <>
    <EditMessageDialog
      key={body}
      open={isEditing}
      initialValue={body}
      onOpenChange={onEditingChange}
      onSave={onSave}
    />

    <DeleteMessageDialog
      open={isConfirmingDelete}
      onOpenChange={onConfirmingDeleteChange}
      onConfirm={onConfirmDelete}
    />
  </>
);
