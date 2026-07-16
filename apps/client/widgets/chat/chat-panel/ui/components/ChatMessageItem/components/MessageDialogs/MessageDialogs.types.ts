export type MessageDialogsProps = {
  body: string;
  isEditing: boolean;
  isConfirmingDelete: boolean;
  onEditingChange: (open: boolean) => void;
  onConfirmingDeleteChange: (open: boolean) => void;
  onSave: (body: string) => void;
  onConfirmDelete: () => void;
};
