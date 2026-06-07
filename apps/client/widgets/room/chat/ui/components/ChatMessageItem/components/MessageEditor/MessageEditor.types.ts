export type MessageEditorProps = {
  initialValue: string;
  onSave: (body: string) => void;
  onCancel: () => void;
};
