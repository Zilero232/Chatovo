export type MessageDialogsProps = {
  body: string;
  isConfirmingDelete: boolean;
  isEditing: boolean;
  onConfirmDelete: () => void;
  onConfirmingDeleteChange: (open: boolean) => void;
  onEditingChange: (open: boolean) => void;
  onSave: (body: string) => void;
};
