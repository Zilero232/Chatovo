export type FilePickerProps = {
  accept?: string;
  className?: string;
  file?: File;
  id?: string;
  placeholder?: string;
  onSelect: (file: File | undefined) => void;
};
