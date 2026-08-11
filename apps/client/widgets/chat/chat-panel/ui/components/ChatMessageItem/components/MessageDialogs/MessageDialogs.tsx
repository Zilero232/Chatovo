'use client';

import { useChatMessage } from '../../../../../model/contexts';
import { DeleteMessageDialog } from '../DeleteMessageDialog';
import { EditMessageDialog } from '../EditMessageDialog';

export const MessageDialogs = () => {
  const {
    message,
    isEditing,
    setIsEditing,
    isConfirmingDelete,
    setIsConfirmingDelete,
    saveEdit,
    confirmDelete
  } = useChatMessage();

  return (
    <>
      <EditMessageDialog
        key={message.message}
        initialValue={message.message}
        open={isEditing}
        onOpenChange={setIsEditing}
        onSave={saveEdit}
      />

      <DeleteMessageDialog
        open={isConfirmingDelete}
        onConfirm={confirmDelete}
        onOpenChange={setIsConfirmingDelete}
      />
    </>
  );
};
