export type EditMessageDialogProps = {
  open: boolean;
  initialValue: string;
  onOpenChange: (open: boolean) => void;
  onSave: (body: string) => void;
};
